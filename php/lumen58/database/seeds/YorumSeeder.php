<?php

use Illuminate\Database\Seeder;
use App\Yorum;
use Faker\Factory as Faker;
class YorumSeeder extends Seeder{
    public function run(){
        $faker = Faker::create("App\Yorum");
        for ($i=1; $i<=10; $i++){
            Yorum::create([
                "email"=>preg_replace('/@example\..*/', '@senocak.tk', $faker->unique()->safeEmail),
                "body"=>$faker->paragraph(),
                "yazi_id"=>rand(1,10)
            ]);
        }
    }
}
