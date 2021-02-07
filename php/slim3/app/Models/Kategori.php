<?php
namespace App\Models;
class Kategori extends \Illuminate\Database\Eloquent\Model{
    protected $table = "kategoriler";
    protected $primaryKey = 'kategori_id';
    protected $fillable = ['kategori_baslik',"kategori_url","kategori_resim","kategori_sira"];
    /*
    public function yazilar()    {
        return $this->hasMany("App\Models\Yazi");
    }
    */
}