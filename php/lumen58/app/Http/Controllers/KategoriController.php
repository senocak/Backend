<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Kategori;

class KategoriController extends Controller{
    public function index(){
        return Kategori::all();
    }
}
