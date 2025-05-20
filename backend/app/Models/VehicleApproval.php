<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_request_id',
        'approver_id',
        'status',
        'level',
        'purpose',
        'note',
    ];

    public function vehicleRequest()
    {
        return $this->belongsTo(VehicleRequest::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
