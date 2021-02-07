<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateYazisTable extends Migration{
    public function up(){
        Schema::create('yazis', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("baslik");
            $table->string("url");
            $table->text("icerik");
            $table->unsignedBigInteger("kategori_id");
            $table->foreign('kategori_id')->references('id')->on('kategoris');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('yazis');
    }
}
