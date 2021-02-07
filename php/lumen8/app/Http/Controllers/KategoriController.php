<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Yazi;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Response;

class KategoriController extends Controller{
    public function getAll(){
        return Kategori::withCount(['yazilar' => function (Builder $query) {
            $query->where('aktif', '1');
        }])->get();
    }
    public function getSingle($url){
        return Kategori::where("url", $url)
            ->withCount(['yazilar' => function (Builder $query) {
                $query->where('aktif', '1');
            }])
            ->first()
            ?: $kategori = response()->json(['hata' => "kategori bulunamadı."], Response::HTTP_NOT_FOUND);
    }
    public function getYazilar($url){
        $kategori_id = $this->getKategoriFromId($url);
        $yazilar = response()->json(['hata' => "kategori bulunamadı."], Response::HTTP_NOT_FOUND);
        if ($kategori_id > 0){
            $yazilar = Yazi::where("aktif", 1)
                //->with("kategori")
                ->where("kategori_id", $kategori_id)
                ->with('kategori')
                ->with(["yorum" => function($q){ $q->where('yorums.onay', '=', 1); }])
                ->orderBy("sira","asc")
                ->paginate($this->limit);
        }
        return $yazilar;
    }
    private function getKategoriFromId($url){
        $kategori = Kategori::where("url", $url)->first();
        return $kategori ? $kategori["id"] : 0;
    }
}
