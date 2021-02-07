<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    public function run(){
        $this->call(KategoriSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(YaziSeeder::class);
        $this->call(YorumSeeder::class);
    }
}
