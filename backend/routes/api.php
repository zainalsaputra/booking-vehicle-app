<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\VehicleRequestController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
});

Route::middleware('auth:api')->group(function () {
    Route::prefix('vehicle-requests')->group(function () {
        Route::get('/', [VehicleRequestController::class, 'index']);
        Route::post('/', [VehicleRequestController::class, 'store']);
        Route::get('{id}', [VehicleRequestController::class, 'show']);
        Route::post('/{id}/approve', [VehicleRequestController::class, 'approve']);
        Route::post('/{id}/reject', [VehicleRequestController::class, 'reject']);
    });
});
