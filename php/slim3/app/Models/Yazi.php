<?php
namespace App\Models;
class Yazi extends \Illuminate\Database\Eloquent\Model{
    protected $table = "yazilar";
    protected $primaryKey = 'yazi_id';
    protected $fillable = ['yazi_baslik',"yazi_url","yazi_icerik","kategori_id","yazi_etiketler","yazi_onecikan"];
    public function kategori(){
        return $this->hasMany("App\Models\Kategori","kategori_id","yazi_id");
    }
}