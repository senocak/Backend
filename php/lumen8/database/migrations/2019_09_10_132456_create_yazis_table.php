<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;

class CreateYazisTable extends Migration{
    public function up(){
        Schema::create('yazis', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->string("baslik");
            $table->string("url")->unique();
            $table->text("icerik");
            $table->uuid("kategori_id")->nullable(false);
            $table
                ->foreign('kategori_id')
                ->references('id')
                ->on('kategoris')
                ->onDelete('cascade');
            $table->text("etiketler")->nullable();
            $table->integer("aktif")->default(1); //1->aktif, 0->pasif
            $table->integer("sira")->default(0);
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('yazis');
    }
}
