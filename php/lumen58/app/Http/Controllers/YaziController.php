<?php
namespace App\Http\Controllers;

use App\Kategori;
use Illuminate\Http\Request;
use App\Yazi;
class YaziController extends Controller{
    public function index($page = 1){
        $limit = 3;
        $current=$page;
        if ($page == 1 || $page == 0 || $page < 1) {
            $page = 0;
        }else{
            $page = ($page*$limit)-$limit;
        }
        $yazilar = Yazi::with("kategori")->with("yorum")->skip($page)->take($limit)->get();
        $toplam = Yazi::all()->count();
        $kategoriler = Kategori::all();
        return view('user')->withYazilar($yazilar)->withToplam($toplam)->withKategoriler($kategoriler)->withPage($page)->withLimit($limit)->withCurrent($current);
        //return view()->file('..\resources\views\user.blade.php');
        //return Yazi::with("kategori")->with("yorum")->paginate(5);
    }
    public function sayfa_index($page = 1){
        return $this->index($page);
    }
}