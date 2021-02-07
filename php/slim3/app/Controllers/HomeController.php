<?php
namespace App\Controllers;
use App\Models\Kategori;
use App\Models\Yazi;
use App\Models\Yorum;
use Respect\Validation\Validator as Validator;
class HomeController extends Controller{
    protected $perPage = 4;
    public function index($request, $response){
        $currentPageStart = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $currentPage = $currentPageStart-1;
        if ($currentPage != 0) {
            $currentPage = $currentPage* $this->perPage;
        }
        //$yazilar= Yazi::with("kategori")->skip($currentPage)->take($this->perPage)->get();
        $yazilar= Yazi::skip($currentPage)->take($this->perPage)->get();
        $total = ceil(Yazi::count()/$this->perPage);
        $kategoriler=Kategori::all();
        return $this->view->render($response,"home.twig",[
                                                            'yazilar' => $yazilar,
                                                            "currentPage"=>$currentPageStart,
                                                            "perPage"=>$this->perPage,
                                                            "total"=>$total,
                                                            "kategoriler"=>$kategoriler
                                                        ]);
    }
    public function detay($request, $response, $args){
        $kategoriler=Kategori::all();
        $yazilar = Yazi::where("yazi_url",$args["url"])->first();
        $yazi_id=$yazilar->yazi_id;
        $yazi_kategori_id=$yazilar->kategori_id;
        $kategori = Kategori::where("kategori_id",$yazi_kategori_id)->first();
        $yorumlar = Yorum::where("yazi_id",$yazi_id)->where("yorum_aktif",1)->get();
        return $this->view->render($response,"yazi.twig",[
            "kategoriler"=>$kategoriler,
            "yazilar"=>$yazilar,
            "yorumlar"=>$yorumlar,
            "kategori"=>$kategori
        ]);
    }
    public function yorum_ekle($request, $response, $args){
        $url = $args["url"];
        $validaton = $this->validator->validate($request,[
            "yorum_email"=>Validator::noWhiteSpace()->notEmpty()->email(),
            "yorum_yorum"=>Validator::notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("detay", ["url"=>$url]));
        }
        $yazi = Yazi::where("yazi_url",$url)->first();
        $yorum_email = $request->getParam("yorum_email");
        $yorum_yorum = $request->getParam("yorum_yorum");
        $yazi_id=$yazi->yazi_id;
        $yorum_create=Yorum::create([
            "yorum_email"=>$yorum_email,
            "yorum_yorum"=>$yorum_yorum,
            "yazi_id"=>$yazi_id,
            "yorum_aktif"=>"0",
        ]);
        $this->flash->addMessage("info","Yorum onaylandıktan sonra yayınlanacak");
        return $response->withRedirect($this->router->pathFor("detay", ["url"=>$url]));
    }
    public function kategori($request, $response, $args){
        $url = $args["url"];
        $kategori_id=Kategori::where("kategori_url",$url)->first()->kategori_id;

        $currentPageStart = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $currentPage = $currentPageStart-1;
        if ($currentPage != 0) {
            $currentPage = $currentPage* $this->perPage;
        }
        $yazilar= Yazi::where("kategori_id",$kategori_id)->skip($currentPage)->take($this->perPage)->get();
        $total = ceil(Yazi::where("kategori_id",$kategori_id)->count()/$this->perPage);
        $kategoriler=Kategori::all();
        return $this->view->render($response,"home.twig",[
                                                            'yazilar' => $yazilar,
                                                            "currentPage"=>$currentPageStart,
                                                            "perPage"=>$this->perPage,
                                                            "total"=>$total,
                                                            "kategoriler"=>$kategoriler
                                                        ]);
    }
}