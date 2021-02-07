<?php

namespace Database\Seeders;

use App\Models\Yazi;
use Illuminate\Database\Seeder;
use \Illuminate\Support\Facades\File;

class YaziSeeder extends Seeder{
    public function run(){
        $json = File::get("database/veriler/yazis.json");
        $data = json_decode($json);
        foreach ($data as $obj) {
            Yazi::create(array(
                'id' => $obj->id,
                'baslik' => $obj->baslik,
                'url' => $obj->url,
                'kategori_id' => $obj->kategori_id,
                'etiketler' => $obj->etiketler,
                'aktif' => $obj->aktif,
                'icerik' => $obj->icerik,
                'sira' => $obj->sira
            ));
        }
    }
}
