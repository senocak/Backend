<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Yorum;

class YorumController extends Controller{
    public function index(){
        return Yorum::all();
    }
}
