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
        $adminRole = Role::where('name', 'admin')->first();
        $approvalRole = Role::where('name', 'approval')->first();

        if (!$adminRole || !$approvalRole) {
            $this->command->error('Role admin atau approval belum ada. Jalankan RoleSeeder dulu.');
            return;
        }

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'approval1@example.com'],
            [
                'name' => 'Approval 1',
                'password' => Hash::make('password'),
                'role_id' => $approvalRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'approval2@example.com'],
            [
                'name' => 'Approval 2',
                'password' => Hash::make('password'),
                'role_id' => $approvalRole->id,
            ]
        );
    }
}
