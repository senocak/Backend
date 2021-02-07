<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Yorum extends Model{
    protected $table = "yorumlar";
    protected $fillable = ['yorum_email',"yazi_id","yorum_yorum","yorum_aktif"];
    protected $primaryKey = 'yorum_id';
}