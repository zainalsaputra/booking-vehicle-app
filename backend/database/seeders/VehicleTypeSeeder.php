<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VehicleType;

class VehicleTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['Pickup', 'SUV', 'Box', 'Truck', 'Van'];

        foreach ($types as $type) {
            VehicleType::create(['name' => $type]);
        }
    }
}
