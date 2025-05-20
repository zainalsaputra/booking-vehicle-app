<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;
    
    protected $table = 'drivers';

    protected $fillable = ['name', 'phone'];

    // public function vehicleRequest()
    // {
    //     return $this->hasMany(VehicleRequest::class);
    // }
}
