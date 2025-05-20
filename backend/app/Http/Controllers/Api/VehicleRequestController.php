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
        $requests = VehicleRequest::with([
            'vehicle.vehicleType',
            'office',
            'driver',
            'approvals'
        ])->orderBy('created_at', 'desc')->get();

        $response = $requests->map(function ($req) {
            return [
                'id' => $req->id,
                'tujuan' => $req->purpose,
                'nama_kantor' => $req->office->name,
                'wilayah_kantor' => $req->office->region,
                'nama_pengemudi' => $req->driver->name,
                'telepon_pengemudi' => $req->driver->phone,
                'nama_kendaraan' => $req->vehicle->name,
                'jenis_kendaraan' => $req->vehicle->vehicleType->name ?? null,
                'nomor_plat' => $req->vehicle->plate_number,
                'kepemilikan' => $req->vehicle->ownership,
                'tanggal_mulai' => $req->start_date,
                'tanggal_selesai' => $req->end_date,
                'status_persetujuan_1' => optional($req->approvals->firstWhere('level', 1))->status,
                'status_persetujuan_2' => optional($req->approvals->firstWhere('level', 2))->status,
                'status' => $req->status,
                'created_at' => $req->created_at,
                'updated_at' => $req->updated_at,
            ];
        });

        return response()->json($response);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
            'office_id' => 'required|exists:offices,id',
            'approver_ids' => 'required|array|min:2',
            'approver_ids.*' => 'exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'purpose' => 'required|string|max:255',
        ]);

        $vehicleRequest = VehicleRequest::create([
            'user_id' => Auth::id(),
            'vehicle_id' => $validated['vehicle_id'],
            'driver_id' => $validated['driver_id'],
            'office_id' => $validated['office_id'],
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

    public function approve(Request $request, $id)
    {
        $requestApproval = VehicleApproval::where('vehicle_request_id', $id)
            ->where('approver_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        $previousLevelsPending = VehicleApproval::where('vehicle_request_id', $id)
            ->where('level', '<', $requestApproval->level)
            ->where('status', '!=', 'approved')
            ->count();

        if ($previousLevelsPending > 0) {
            return response()->json([
                'message' => 'Anda tidak dapat menyetujui sebelum approver di level sebelumnya menyetujui.'
            ], 403);
        }

        $requestApproval->update([
            'status' => 'approved',
            'note' => $request->note
        ]);

        $pendingCount = VehicleApproval::where('vehicle_request_id', $id)
            ->where('status', 'pending')
            ->count();

        if ($pendingCount === 0) {
            $requestModel = VehicleRequest::find($id);
            $requestModel->update(['status' => 'approved']);
        }

        ActivityLogger::log(
            module: 'vehicle_approval',
            action: 'approve',
            description: 'Approver menyetujui permintaan kendaraan',
            data: $requestApproval->toArray()
        );

        return response()->json([
            'message' => 'Permintaan kendaraan disetujui',
            'data' => $requestApproval
        ]);
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'note' => 'required|string|max:255'
        ]);

        $requestApproval = VehicleApproval::where('vehicle_request_id', $id)
            ->where('approver_id', Auth::id())
            ->where('status', 'pending')
            ->orderBy('level')
            ->firstOrFail();

        $requestApproval->update([
            'status' => 'rejected',
            'note' => $request->note
        ]);

        // Ubah status utama menjadi "rejected" secara keseluruhan
        $requestModel = VehicleRequest::find($id);
        $requestModel->update(['status' => 'rejected']);

        ActivityLogger::log(
            module: 'vehicle_approval',
            action: 'reject',
            description: 'User menolak permintaan kendaraan',
            data: $requestApproval->toArray()
        );

        return response()->json([
            'message' => 'Permintaan kendaraan ditolak',
            'data' => $requestApproval
        ]);
    }
}
