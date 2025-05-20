<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\VehicleRequest;
use App\Models\VehicleApproval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehicleRequestController extends Controller
{
    public function index()
    {
        $requests = VehicleRequest::with(['vehicle', 'driver', 'approvals', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'vehicle_driver_id' => 'required|exists:vehicle_drivers,id',
            'approver_ids' => 'required|array|min:2',
            'approver_ids.*' => 'exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'purpose' => 'required|string|max:255',
        ]);

        $vehicleRequest = VehicleRequest::create([
            'user_id' => Auth::id(),
            'vehicle_id' => $validated['vehicle_id'],
            'vehicle_driver_id' => $validated['vehicle_driver_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'purpose' => $validated['purpose'],
            'status' => 'pending',
        ]);

        foreach ($validated['approver_ids'] as $level => $approverId) {
            VehicleApproval::create([
                'vehicle_request_id' => $vehicleRequest->id,
                'approver_id' => $approverId,
                'level' => $level + 1,
                'status' => 'pending',
            ]);
        }

        ActivityLogger::log(
            module: 'vehicle_request',
            action: 'create',
            description: 'User membuat pemesanan kendaraan',
            data: $vehicleRequest->toArray()
        );

        return response()->json([
            'message' => 'Pemesanan kendaraan berhasil dibuat',
            'data' => $vehicleRequest->load('approvals')
        ], 201);
    }

    public function show($id)
    {
        $request = VehicleRequest::with(['vehicle', 'driver', 'user', 'approvals.approver'])->findOrFail($id);

        return response()->json($request);
    }
}
