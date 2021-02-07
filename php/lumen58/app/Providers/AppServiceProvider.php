<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema; //NEW: Import Schema

class AppServiceProvider extends ServiceProvider{
    public function register(){
        $this->app->register(\Tymon\JWTAuth\Providers\LumenServiceProvider::class);
    }
    public function boot(){
        Schema::defaultStringLength(191); //NEW: Increase StringLength
    }
}
