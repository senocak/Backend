<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;
use \Illuminate\Support\Facades\File;

class KategoriSeeder extends Seeder{
    public function run(){
        $json = File::get("database/veriler/kategoris.json");
        $data = json_decode($json);
        foreach ($data as $obj) {
            Kategori::create(array(
                'id' => $obj->id,
                'baslik' => $obj->baslik,
                'url' => $obj->url,
                "resim"=>$obj->resim
            ));
        }
    }
}
