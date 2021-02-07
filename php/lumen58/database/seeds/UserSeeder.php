<?php

use Illuminate\Database\Seeder;
use App\User;
class UserSeeder extends Seeder{
    public function run(){
        User::create([
            "name"=>"Lorem Ipsum",
            "email"=>"lorem@ipsum.com",
            "password"=>'$2y$10$u4.HmpmEjDj9VcDNeFZ9M.jlzet9V3ofsid5Xp5u275.pd6.L5qKO' //Hash::make('12345678')
        ]);
    }
}
