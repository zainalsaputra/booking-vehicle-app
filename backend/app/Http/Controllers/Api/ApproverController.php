<?php

namespace App\Http\Controllers\Api;

use App\Models\User;

class ApproverController extends BaseController
{
    public function index()
    {
        $response = User::where('role_id', 2)->get();

        return $this->sendResponse($response, 'User registered successfully.');
    }
}
