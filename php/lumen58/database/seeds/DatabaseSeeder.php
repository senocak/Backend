<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    public function run(){
        $this->call('UserSeeder');
        $this->call('KategoriSeeder');
        $this->call("YaziSeeder");
        $this->call("YorumSeeder");
    }
}
