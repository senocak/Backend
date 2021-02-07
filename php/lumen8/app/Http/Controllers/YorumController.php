<?php

namespace App\Http\Controllers;

use App\Models\Yazi;
use App\Models\Yorum;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Throwable;
use \Illuminate\Support\Str;

class YorumController{
    protected $yorum_icerik_max_len = 500;
    public function getSingle(Request $request, $id){
        $yorum = Yorum::where("id", $id)->first();
        if (($request->query('yazi') and $request->query('yazi') == "1"))
            $yorum = Yorum::where("id", $id)->with('yazi')->first();
        if ($yorum) {
            if ($yorum->onay == 1){
                $status = Response::HTTP_OK;
                $response = $yorum;
            }else{
                $status = Response::HTTP_BAD_REQUEST;
                $response = ["hata" => "Yorum aktif değil"];
            }
        }else{
            $status = Response::HTTP_NOT_FOUND;
            $response = ["hata" => "Yorum bulunamadı"];
        }
        return response()->json($response, $status);
    }
    public function post(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'email' => "required|email",
                'yorum' => "required|string|min:5|max:$this->yorum_icerik_max_len",
                'yazi_url' => 'required|string',
            ]);
            if($validator->fails()){
                $status = Response::HTTP_BAD_REQUEST;
                $response = ['hata' =>  $validator->errors()];
            }else{
                $check_yazi_exist = Yazi::where("url", $request->yazi_url)->first();
                if ($check_yazi_exist){
                    $yorum = new Yorum();
                    $yorum_id = Str::uuid();
                    $yorum->id = $yorum_id;
                    $yorum->email = $request->email;
                    $yorum->yorum = $request->yorum;
                    $yorum->yazi_id = $check_yazi_exist->id;
                    $yorum->onay = 0;
                    $yorum->save();
                    $status = Response::HTTP_CREATED;
                    $response["id"] = $yorum_id;
                    $response["email"] = $yorum->email;
                    $response["yorum"] = $yorum->yorum;
                    $response["onay"] = false;
                    $response["created_at"] = $yorum->created_at;
                    //$response["yazi"]["baslik"] = $check_yazi_exist->baslik;
                }else{
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ["hata" => "Yazi bulunamadı"];
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
}
