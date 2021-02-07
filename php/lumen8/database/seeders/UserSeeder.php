<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder{
    public function run(){
        User::create(array(
            'id' => 1,
            'name' => "Anıl Şenocak",
            'email' => "anil@bilgimedya.com.tr",
            'email_verified_at' => "2019-07-26 19:36:42",
            'password' => Hash::make("anil@bilgimedya.com.tr"),
            'remember_token' => null,
            'created_at' => "2019-07-26 19:36:42",
            'updated_at' => "2019-07-26 19:36:42"
        ));
    }
}
