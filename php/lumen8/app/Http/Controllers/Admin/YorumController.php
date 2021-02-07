<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Yorum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Throwable;

class YorumController extends Controller {
    public function patch(Request $request, $id){
        try{
            $validator = Validator::make($request->all(), [
                'onay' => "required|boolean",
            ]);
            $status = 400;
            if($validator->fails()){
                $response = ['hata' =>  $validator->errors()];
            }else if ($request->onay and $request->onay != "1" and $request->onay != "0"){
                $response = ['hata' => "Geçersiz onay. true/false yada 1/0 olmalı $request->onay ".gettype($request->onay)];
            } else{
                $yorum = Yorum::where("id", $id)->first();
                if ($yorum){
                    $yorum->onay = $request->onay;
                    $yorum->updated_at = Carbon::now();
                    $yorum->save();
                    $status = 200;
                    $response = $yorum;
                }else{
                    $status = 404;
                    $response = ["hata" => "Yorum bulunamadı."];
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
