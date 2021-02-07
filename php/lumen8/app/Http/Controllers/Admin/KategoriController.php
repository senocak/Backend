<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class KategoriController extends Controller {
    public function post(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'baslik' => 'required|min:5|max:25',
                'image' => 'required|image|max:1024',
            ]);
            $status = 200;
            $response = [];
            if($validator->fails()){
                $status = 400;
                $response = ['hata' =>  $validator->errors()];
            }else{
                if ($request->hasFile('image')) {
                    $url = Str::slug($request->baslik);
                    $check_kat_exist = Kategori::where("url", $url)->first();
                    if ($check_kat_exist){
                        $status = 400;
                        $response = ["hata" => "Kategori zaten kayıtlı"];
                    }else{
                        $kategori = new Kategori;
                        $kategori->baslik = $request->baslik;
                        $kategori->url = $url;
                        $image = $request->file('image');
                        $image_name = $url."_".time().".".$image->getClientOriginalExtension();
                        $image->move("./kategoriler/", $image_name);
                        $kategori->resim = $image_name;
                        $kategori->save();
                        $status = 201;
                        $response = $kategori;
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
            $kategori = Kategori::where("url", $url)->first();
            if ($kategori){
                if ($request->baslik){
                    $kategori->baslik = $request->baslik;
                    $url = Str::slug($request->baslik);
                    $kategori->url = $url;
                }
                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $image_name = $kategori->url."_".time().".".$image->getClientOriginalExtension();
                    $image->move("./kategoriler/", $image_name);
                    $kategori->resim = $image_name;
                }
                $kategori->updated_at = Carbon::now();
                $kategori->save();
                $status = 200;
                $response = $kategori;
            }else{
                $status = 404;
                $response = ["hata" => "Kategori bulunamadı."];
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
            $kategori = Kategori::where("url", $url)->first();
            if ($kategori){
                $kategori->delete();
                $status = 200;
                $response = ["mesaj" => "Kategori silindi."];
            }else{
                $status = 404;
                $response = ["hata" => "Kategori bulunamadı."];
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
