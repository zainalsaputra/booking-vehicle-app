<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleRequest;

class VehicleStatisticsController extends Controller
{
    public function usagePerMonth()
    {
        $data = VehicleRequest::selectRaw('DATE_FORMAT(start_date, "%Y-%m") as month, COUNT(*) as total')
            ->where('status', 'approved')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }
}
