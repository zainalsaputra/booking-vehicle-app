<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = [
            ['name' => 'Ahmad Rofiq', 'phone' => '08123456789'],
            ['name' => 'Budi Santoso', 'phone' => '08234567890'],
            ['name' => 'Citra Ayu', 'phone' => '08345678901'],
        ];

        foreach ($drivers as $driver) {
            Driver::create($driver);
        }
    }
}
