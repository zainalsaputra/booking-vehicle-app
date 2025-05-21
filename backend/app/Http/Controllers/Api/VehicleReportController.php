<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VehicleRequest;

class VehicleReportController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $requests = VehicleRequest::with([
            'vehicle',
            'user',
            'vehicle.vehicleType',
            'office',
            'driver',
            'approvals'
        ])
            ->whereBetween('start_date', [$request->start_date, $request->end_date])
            ->orderBy('start_date')
            ->get();

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
}
