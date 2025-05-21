<?php

use App\Http\Controllers\Api\ApproverController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleRequestController;
use App\Http\Controllers\VehicleStatisticsController;

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
        Route::delete('/{id}', [VehicleRequestController::class, 'destroy']);
    });
});

Route::prefix('approvals')->middleware('auth:api')->group(function () {
    Route::get('/pending', [VehicleRequestController::class, 'pendingApprovals']);
    Route::get('/history', [VehicleRequestController::class, 'approvalHistory']);
});

Route::get('/vehicle-statistics/usage-per-month', [VehicleStatisticsController::class, 'usagePerMonth']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/offices', [OfficeController::class, 'index']);
Route::get('/drivers', [DriverController::class, 'index']);
Route::get('/approvers', [ApproverController::class, 'index']);

