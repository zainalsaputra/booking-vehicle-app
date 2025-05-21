<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Office;
use Illuminate\Http\Request;

class OfficeController extends BaseController
{
    public function index()
    {
        $response = Office::all();

        return $this->sendResponse($response, 'User registered successfully.');
    }
}
