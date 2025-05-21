<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends BaseController
{
    public function index()
    {
        $response = Driver::all();

        return $this->sendResponse($response, 'User registered successfully.');
    }
}
