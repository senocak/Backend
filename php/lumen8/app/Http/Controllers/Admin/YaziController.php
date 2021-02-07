<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Yazi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use \Illuminate\Http\Response;
use Throwable;

class YaziController extends Controller {
    protected $yazi_baslik_max_len = 30;
    protected $yazi_icerik_min_len = 5;
    protected $yazi_etiketler_max_len = 50;

    public function post(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'baslik' => "required|min:5|max:$this->yazi_baslik_max_len",
                'icerik' => "required|min:$this->yazi_icerik_min_len",
                'kategori_id' => 'required|string|max:50',
            ]);
            if($validator->fails()){
                $status = Response::HTTP_BAD_REQUEST;
                $response = ['hata' =>  $validator->errors()];
            }else{
                $url = Str::slug($request->baslik);
                $check_yazi_exist = Yazi::where("url", $url)->first();
                if ($check_yazi_exist){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => "Yazi zaten kayıtlı"];
                }else{
                    $kategori = Kategori::where("id", $request->kategori_id)->first();
                    if (!$kategori){
                        $status = Response::HTTP_FORBIDDEN;
                        $response = ["hata" => ["kategori_id" => ["geçersiz kategori_id"]]];
                    }else{
                        $yazi = new Yazi;
                        $yazi->baslik = $request->baslik;
                        $yazi->url = $url;
                        $yazi->icerik = $request->icerik;
                        $yazi->kategori_id = $request->kategori_id;
                        $yazi->etiketler = $request->etiketler ? $request->etiketler : "";
                        $yazi->aktif = ($request->aktif == "true") ? 1 : 0;
                        $yazi->save();
                        $status = Response::HTTP_CREATED;
                        $response = $yazi;
                        $response["kategori"] = $kategori;
                    }
                }
            }
        }catch (Throwable $e){
            $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            $response = [
                "hata"=>"Beklenmedik hata oluştu.",
                "kod" => $e->getCode(),
                "mesaj" => $e->getMessage()
            ];
        }
        return response()->json($response, $status);
    }
    public function patch(Request $request, $url){
        try{
            $yazi = Yazi::where("url", $url)->first();
            if ($yazi){
                if ($request->baslik != null and strlen($request->baslik) > $this->yazi_baslik_max_len){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => ["baslik" => ["baslik çok uzun. Max: $this->yazi_baslik_max_len"]]];
                }else if ($request->icerik != null and strlen($request->icerik) < $this->yazi_icerik_min_len){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => ["icerik" => ["icerik çok kısa. Min: $this->yazi_icerik_min_len"]]];
                }else if ($request->kategori_id != null and $request->kategori_id == true and $request->kategori_id == false and is_integer($request->kategori_id) == true){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => ["kategori_id" => ["numeric değer olmalı"]]];
                }else if ($request->etiketler != null and strlen($request->etiketler) > $this->yazi_etiketler_max_len){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => ["etiketler" => ["etiketler çok uzun. Max: $this->yazi_etiketler_max_len"]]];
                }else if ($request->aktif != null and $request->aktif != "true" and $request->aktif != "false"){
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => ["aktif" => ["değer true yada false olmalı"]]];
                }else{
                    $kategori = Kategori::where("id", $request->kategori_id)->first();
                    if (!$kategori){
                        $status = Response::HTTP_FORBIDDEN;
                        $response = ["hata" => ["kategori_id" => ["geçersiz kategori_id"]]];
                    }else{
                        if ($request->baslik){
                            $yazi->baslik = $request->baslik;
                            $yazi->url = Str::slug($request->baslik);
                        }
                        if ($request->icerik) $yazi->icerik = $request->icerik;
                        if ($request->kategori_id) $yazi->kategori_id = $request->kategori_id;
                        if ($request->etiketler) $yazi->etiketler = $request->etiketler;

                        if ($request->aktif and $request->aktif == "true") $yazi->aktif = 1;
                        if ($request->aktif and $request->aktif == "false") $yazi->aktif = 0;
                        $yazi->updated_at = Carbon::now();
                        $yazi->save();
                        $status = Response::HTTP_OK;
                        $response = $yazi;
                    }
                }
            }else{
                $status = Response::HTTP_NOT_FOUND;
                $response = ["hata" => "Yazı bulunamadı."];
            }
        }catch (Throwable $e){
            $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            $response = [
                "hata"=>"Beklenmedik hata oluştu.",
                "kod" => $e->getCode(),
                "mesaj" => $e->getMessage()
            ];
        }
        return response()->json($response, $status);
    }
    public function delete($url){
        try{
            $yazi = Yazi::where("url", $url)->first();
            if ($yazi){
                if ($yazi->aktif == 1 or $yazi->aktif == "1"){
                    $yazi->delete();
                    $status = Response::HTTP_OK;
                    $response = ["mesaj" => "Yazı silindi."];
                }else{
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["mesaj" => "Yazı aktif değil, silinemez."];
                }
            }else{
                $status = Response::HTTP_NOT_FOUND;
                $response = ["hata" => "Yazı bulunamadı."];
            }
        }catch (Throwable $e){
            $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            $response = [
                "hata"=>"Beklenmedik hata oluştu.",
                "kod" => $e->getCode(),
                "mesaj" => $e->getMessage()
            ];
        }
        return response()->json($response, $status);
    }
}
