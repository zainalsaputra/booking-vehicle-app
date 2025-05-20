<?php

namespace App\Http\Controllers\Api;

use App\Models\Vehicle;

class VehicleController extends BaseController
{
    public function index()
    {
        $response = Vehicle::all();

        return $this->sendResponse($response, 'User registered successfully.');
    }
}
