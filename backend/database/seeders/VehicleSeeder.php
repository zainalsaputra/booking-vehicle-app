<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['name' => 'Toyota Hilux', 'plate_number' => 'N 1234 AB', 'ownership' => 'company', 'vehicle_type_id' => 1],
            ['name' => 'Mitsubishi Triton', 'plate_number' => 'L 5678 CD', 'ownership' => 'rented', 'vehicle_type_id' => 2],
            ['name' => 'Isuzu D-Max', 'plate_number' => 'B 9012 EF', 'ownership' => 'company', 'vehicle_type_id' => 1],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
