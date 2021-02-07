<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKategorisTable extends Migration{
    public function up(){
        Schema::create('kategoris', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->string("baslik");
            $table->string("url")->unique();
            $table->string("resim")->default("no-image.png");
            $table->integer("sira")->default(0);
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('kategoris');
    }
}
