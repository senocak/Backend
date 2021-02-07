<?php

use Illuminate\Database\Seeder;
use App\Yazi;
use Faker\Factory as Faker;
class YaziSeeder extends Seeder{
    public function run(){
        $faker = Faker::create("App\Yazi");
        for ($i=1; $i<=10; $i++){
            Yazi::create([
                "baslik"=>$faker->name(),
                "icerik"=>$faker->sentence(1000),
                "url"=>$faker->slug(),
                "kategori_id"=>rand(1,5),
                "user_id"=>1
            ]);
        }
    }
}
