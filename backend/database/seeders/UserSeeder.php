<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role_id' => 1,
            ]
        );

        User::firstOrCreate(
            ['email' => 'approval1@example.com'],
            [
                'name' => 'Approval 1',
                'password' => Hash::make('password'),
                'role_id' => 2,
            ]
        );

        User::firstOrCreate(
            ['email' => 'approval2@example.com'],
            [
                'name' => 'Approval 2',
                'password' => Hash::make('password'),
                'role_id' => 2,
            ]
        );
    }
}
