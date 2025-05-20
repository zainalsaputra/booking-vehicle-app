<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Office;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $offices = [
            ['name' => 'Kantor Pusat', 'region' => 'Surabaya'],
            ['name' => 'Kantor Cabang I', 'region' => 'Malang'],
            ['name' => 'Kantor Cabang II', 'region' => 'Jember'],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
