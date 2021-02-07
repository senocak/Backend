<?php
namespace App\Controllers;
use App\Models\Kategori;
use App\Models\Yazi;
use App\Models\Yorum;
use Respect\Validation\Validator as Validator;
class AdminController extends Controller{
    public function index($request, $response){
        $yazilar = Yazi::all();
        $kategoriler = Kategori::all();
        return $this->view->render($response,"admin/index.twig",[
            "yazilar"=>$yazilar,
            "kategoriler"=>$kategoriler
        ]);
    }
    public function yazi_ekle($request, $response){
        $kategoriler = Kategori::all();
        return $this->view->render($response,"admin/yazi_ekle.twig",["kategoriler"=>$kategoriler]);
    }
    public function yazi_ekle_post($request, $response){
        $validaton = $this->validator->validate($request,[
            "yazi_baslik"=>Validator::notEmpty(),
            "yazi_icerik"=>Validator::notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("admin.yazi.ekle"));
        }
        $yazi_baslik=$request->getParam("yazi_baslik");
        $yazi_url = $this->url_duzenle($this->kucuk($yazi_baslik));
        $yazi_icerik=$request->getParam("yazi_icerik");
        $kategori_id=$request->getParam("kategori_id");
        $yazi_etiketler=$request->getParam("yazi_etiketler");
        $yazi_onecikan=$request->getParam("yazi_onecikan");
        if ($yazi_onecikan == "on") {
            $yazi_onecikan = 1;
        }else{
            $yazi_onecikan = 0;
        }
        $yazi_ekle=Yazi::create([
            "yazi_baslik" => $yazi_baslik,
            "yazi_url"=>$yazi_url,
            "yazi_icerik"=>$yazi_icerik,
            "kategori_id"=>$kategori_id,
            "yazi_etiketler"=>$yazi_etiketler,
            "yazi_onecikan"=>$yazi_onecikan
        ]);
        if ($yazi_ekle) {
            $this->flash->addMessage("info","Yazı Eklendi.");
            return $response->withRedirect($this->router->pathFor("admin.index"));
        }else{
            $this->flash->addMessage("error","Bişeyler Yanlış Gitti.");
            return $response->withRedirect($this->router->pathFor("admin.yazi.ekle"));
        }
    }
    public function yazi_sil($request, $response, $arg){
        $url = $arg["url"];
        try {
            $yazi = Yazi::where("yazi_url",$url)->delete();
            $this->flash->addMessage("info","Yazı Silindi");
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
        }
        return $response->withRedirect($this->router->pathFor("admin.index"));
    }
    public function yazi_duzenle($request, $response, $arg){
        $url = $arg["url"];
        try {
            $yazi = Yazi::where("yazi_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.index"));
        }
        $kategoriler = Kategori::all();
        return $this->view->render($response,"admin/yazi_duzenle.twig",["url"=>$url,"yazi"=>$yazi,"kategoriler"=>$kategoriler]);
    }
    public function yazi_duzenle_post($request, $response, $arg){
        $url = $arg["url"];
        $validaton = $this->validator->validate($request,[
            "yazi_baslik"=>Validator::notEmpty(),
            "yazi_icerik"=>Validator::notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("admin.yazi.duzenle",["url"=>$url]));
        }
        $yazi_baslik=$request->getParam("yazi_baslik");
        $yazi_url = $this->url_duzenle($this->kucuk($yazi_baslik));
        $yazi_icerik=$request->getParam("yazi_icerik");
        $kategori_id=$request->getParam("kategori_id");
        $yazi_etiketler=$request->getParam("yazi_etiketler");
        $yazi_onecikan=$request->getParam("yazi_onecikan");
        if ($yazi_onecikan == "on") {
            $yazi_onecikan = 1;
        }else{
            $yazi_onecikan = 0;
        }
        try {
            $yazi = Yazi::where("yazi_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.yazi.duzenle",["url"=>$url]));
        }
        $yazi->yazi_baslik = $yazi_baslik;
        $yazi->yazi_url = $yazi_url;
        $yazi->yazi_icerik = $yazi_icerik;
        $yazi->kategori_id = $kategori_id;
        $yazi->yazi_etiketler = $yazi_etiketler;
        $yazi->yazi_onecikan = $yazi_onecikan;
        $yazi->save();
        $this->flash->addMessage("info","Yazı Güncellendi.");
        return $response->withRedirect($this->router->pathFor("admin.index"));
    }
    public function sabitle($request, $response, $arg){
        $url = $arg["url"];
        try {
            $yazi = Yazi::where("yazi_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.yazi.duzenle",["url"=>$url]));
        }
        $yazi_onecikan = $yazi->yazi_onecikan;
        echo $yazi_onecikan;
        if($yazi_onecikan == 1){
            $yazi->yazi_onecikan = 0;
        }else{
            $yazi->yazi_onecikan = 1;
        }
        $yazi->save();
        $this->flash->addMessage("info","Yazı Güncellendi.");
        return $response->withRedirect($this->router->pathFor("admin.index"));
    }
    public function kategoriler($request, $response){
        $kategoriler = Kategori::all();
        return $this->view->render($response,"admin/kategoriler.twig",["kategoriler"=>$kategoriler]);
    }
    public function kategoriler_ekle($request, $response, $arg){
        $validaton = $this->validator->validate($request,[
            "kategori_baslik"=>Validator::notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("admin.kategoriler"));
        }
        $kategori_baslik = $request->getParam("kategori_baslik");
        $kategori_url = $this->url_duzenle($this->kucuk($kategori_baslik));
        
        $uploadedFiles = $request->getUploadedFiles();
        $uploadedFile = $uploadedFiles['kategori_resim'];
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = $this->moveUploadedFile($this->dir, $uploadedFile,$kategori_url);
            Kategori::create([
                "kategori_baslik"=>$kategori_baslik,
                "kategori_url"=>$kategori_url,
                "kategori_resim"=>$filename,
                "kategori_sira"=>0
            ]);
            $this->flash->addMessage("info","Kategori Eklendi.");
        }else{
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
        }
        return $response->withRedirect($this->router->pathFor("admin.kategoriler"));   
    }
    public function kategoriler_duzenle($request, $response, $arg){
        $url = $arg["url"];
        try {
            $kategori=Kategori::where("kategori_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.kategoriler"));   
        }
        return $this->view->render($response,"admin/kategoriler_duzenle.twig",["kategori"=>$kategori]);
    }
    public function kategoriler_duzenle_post($request, $response, $arg){
        $url = $arg["url"];
        $validaton = $this->validator->validate($request,[
            "kategori_baslik"=>Validator::notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("admin.kategoriler"));
        }
        $kategori_baslik = $request->getParam("kategori_baslik");
        $uploadedFiles = $request->getUploadedFiles();
        $uploadedFile = $uploadedFiles['kategori_resim'];
        try {
            $kategori=Kategori::where("kategori_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.kategoriler"));   
        }
        $kategori_url = $this->url_duzenle($this->kucuk($kategori_baslik));
        $kategori->kategori_baslik = $kategori_baslik;
        $kategori->kategori_url = $kategori_url;
        if ($uploadedFile->file == null || $uploadedFile->file == "") {
            $this->flash->addMessage("info","Sadece Kategori Başlık Güncellendi.");
        }else{
            if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                $filename = $this->moveUploadedFile($this->dir, $uploadedFile,$kategori_url);
                $kategori->kategori_resim = $filename;
                $this->flash->addMessage("info","Kategori Güncellendi..");
            }else{
                $this->flash->addMessage("error",$uploadedFile->getError());
            }
        }
        $kategori->save();
        return $response->withRedirect($this->router->pathFor("admin.kategoriler"));   
    }
    public function kategoriler_sil($request, $response, $arg){
        $url = $arg["url"];
        try {
            $kategori = Kategori::where("kategori_url",$url)->firstOrFail();
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.kategoriler"));
        }
        $kategori->delete();
        $this->flash->addMessage("error","Kategori Silindi");
        return $response->withRedirect($this->router->pathFor("admin.kategoriler"));   
    }
    public function yorumlar($request, $response){
        $yorumlar = Yorum::all();
        $yazilar = Yazi::all();
        return $this->view->render($response,"admin/yorumlar.twig",["yorumlar"=>$yorumlar,"yazilar"=>$yazilar]);
    }
    public function yorumlar_pasif($request, $response, $arg){
        $id = $arg["id"];
        try {
            $yorum = Yorum::findOrFail($id);
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.yorumlar"));
        }
        if ($yorum->yorum_aktif == 1) {
            $yorum->yorum_aktif = 0;
        } else {
            $yorum->yorum_aktif = 1;
        }
        $yorum->save();
        $this->flash->addMessage("info","Yorum Güncellendi");
        return $response->withRedirect($this->router->pathFor("admin.yorumlar"));
    }
    public function yorumlar_sil($request, $response, $arg){
        $id = $arg["id"];
        try {
            $yorum = Yorum::findOrFail($id);
        } catch (\Throwable $th) {
            $this->flash->addMessage("error",$th->getMessage());
            return $response->withRedirect($this->router->pathFor("admin.yorumlar"));
        }
        $yorum->delete();
        $this->flash->addMessage("info","Yorum Silindi");
        return $response->withRedirect($this->router->pathFor("admin.yorumlar"));
    }
}