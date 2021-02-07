<?php

use App\Middleware\AuthMiddleware;
use App\Middleware\GuestMiddleware;

$app->get("/","HomeController:index")->setName("index");
$app->group("", function(){    
    $this->get("/auth","AuthController:getKayıt")->setName("auth");
    $this->post("/auth/kayit","AuthController:postKayıt")->setName("auth.postKayıt");
    $this->post("/auth/giris","AuthController:postGiris")->setName("auth.postGiris");
})->add(new GuestMiddleware($container));;
$app->group("", function(){
    $this->get("/auth/cikis","AuthController:cikis")->setName("auth.cikis");
    $this->get("/auth/sifre","AuthController:getSifreDegistir")->setName("auth.getSifreDegistir");
    $this->post("/auth/sifre","AuthController:postSifreDegistir")->setName("auth.postSifreDegistir");
    $this->get("/admin/yazilar","AdminController:index")->setName("admin.index");
    $this->get("/admin/yazilar/ekle","AdminController:yazi_ekle")->setName("admin.yazi.ekle");
    $this->post("/admin/yazilar/ekle","AdminController:yazi_ekle_post")->setName("admin.yazi.ekle.post");
    $this->get("/admin/yazilar/{url}/sil","AdminController:yazi_sil")->setName("admin.yazi.sil");
    $this->get("/admin/yazilar/{url}/duzenle","AdminController:yazi_duzenle")->setName("admin.yazi.duzenle");
    $this->post("/admin/yazilar/{url}/duzenle","AdminController:yazi_duzenle_post")->setName("admin.yazi.duzenle.post");
    $this->get("/admin/yazilar/{url}/sabitle","AdminController:sabitle")->setName("admin.yazi.sabitle");
    $this->get("/admin/kategoriler","AdminController:kategoriler")->setName("admin.kategoriler");
    $this->post("/admin/kategoriler","AdminController:kategoriler_ekle")->setName("admin.kategoriler.ekle.post");
    $this->get("/admin/kategoriler/{url}/duzenle","AdminController:kategoriler_duzenle")->setName("admin.kategoriler.duzenle");
    $this->post("/admin/kategoriler/{url}/duzenle","AdminController:kategoriler_duzenle_post")->setName("admin.kategoriler.duzenle.post");
    $this->get("/admin/kategoriler/{url}/sil","AdminController:kategoriler_sil")->setName("admin.kategoriler.sil");
    $this->get("/admin/yorumlar","AdminController:yorumlar")->setName("admin.yorumlar");
    $this->get("/admin/yorumlar/{id}/pasif","AdminController:yorumlar_pasif")->setName("admin.yorumlar.pasif");
    $this->get("/admin/yorumlar/{id}/sil","AdminController:yorumlar_sil")->setName("admin.yorumlar.sil");
})->add(new AuthMiddleware($container));

$app->get("/yazi/{url}","HomeController:detay")->setName("detay");
$app->post("/yazi/{url}","HomeController:yorum_ekle");
$app->get("/kategori/{url}","HomeController:kategori")->setName("kategori");