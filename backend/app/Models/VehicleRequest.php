<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleRequest extends Model
{
    use HasFactory;

     protected $fillable = [
        'user_id',
        'vehicle_id',
        'vehicle_driver_id',
        'start_date',
        'end_date',
        'purpose',
        'status'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function approvals()
    {
        return $this->hasMany(VehicleApproval::class);
    }
}
