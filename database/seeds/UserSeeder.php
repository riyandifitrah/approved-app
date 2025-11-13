<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin Terhormat',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'),
            'role' => 'admin',
            'created_by' => 1,
        ]);

        User::create([
            'name' => 'User Terhormat',
            'username' => 'user',
            'email' => 'user@example.com',
            'password' => Hash::make('user'),
            'role' => 'user',
            'created_by' => 1,
        ]);
    }
}
