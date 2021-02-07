<?php

namespace App\Http\Controllers;

use App\Models\Yazi;

class YaziController extends Controller{
    public function getAll(){
        $yazilar = Yazi::where("aktif", 1)
            ->with('kategori')
            ->with(["yorum" => function($q){ $q->where('yorums.onay', '=', 1)->orderBy('created_at', "asc"); }])
            ->orderBy("sira","asc")
            ->paginate($this->limit);
        return $yazilar;
    }
    public function getSingle($url){
        $yazi = Yazi::where("url", $url)
            ->with('kategori')
            ->with(["yorum" => function($q){ $q->where('yorums.onay', '=', 1)->orderBy('created_at', "desc"); }])
            ->orderBy("sira","asc")
            ->first();
        if ($yazi and $yazi->aktif == 1){
            $status = 200;
            $response = $yazi;
        }elseif ($yazi and $yazi->aktif == 0){
            $status = 400;
            $response = ["hata" => "Yazi aktif değil"];
        }else{
            $status = 404;
            $response = ["hata" => "Yazi bulunamadı"];
        }
        return response()->json($response, $status);
    }
}
