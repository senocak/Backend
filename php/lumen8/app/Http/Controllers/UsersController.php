<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
//use Laravel\Passport\Client;
use GuzzleHttp\Psr7\ServerRequest;
use \Laminas\Diactoros\Response\ArraySerializer;
use \Dusterio\LumenPassport\Http\Controllers\AccessTokenController;
use Throwable;

class UsersController extends Controller{
    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'isim' => 'required|min:3|max:25',
            'email' => 'required|email|unique:users|min:5|max:50',
            'sifre' => 'required|min:5|max:50'
        ]);
        if($validator->fails()){
            $status = Response::HTTP_BAD_REQUEST;
            $response = ['message' => 'Geçersiz bilgiler', 'hata' =>  $validator->errors()];
        }else{
            $user = User::create(array(
                'name' => $request->isim,
                'email' => $request->email,
                'password' => Hash::make($request->sifre)
            ));
            $status = Response::HTTP_CREATED;
            $response = ['mesaj'=>"Kullanıcı oluşturuldu"];
        }
        return response()->json($response, $status);
    }
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:50',
            'sifre' => 'required|string|min:6|max:30',
        ]);
        if ($validator->fails()) {
            $status = Response::HTTP_BAD_REQUEST;
            $response = ['hata'=>$validator->errors()];
        }else{
            $myRequest = new ServerRequest('POST','');
            $myRequest = $myRequest->withParsedBody([
                'grant_type' => 'password',
                'client_id' => env("PASSPORT_PERSONAL_ACCESS_CLIENT_ID"),
                'client_secret' => env("PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET"),
                'username' => $request->email,
                'password' => $request->sifre,
                'scope' => '*',
            ]);
            try {
                $request_to_token = ArraySerializer::toArray(app(AccessTokenController::class)->issueToken($myRequest));
                $response = json_decode($request_to_token['body']);
                $status = json_decode($request_to_token['status_code']);
            } catch (Throwable $e){
                $status = Response::HTTP_INTERNAL_SERVER_ERROR;
                $response = [
                    "hata"=>"Beklenmedik hata oluştu.",
                    "kod" => $e->getCode(),
                    "mesaj" => $e->getMessage()
                ];
            }
        }
        return response()->json($response, $status);
    }
    public function get(Request $request){
        return $request->user();
    }
    public function patch(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:50'
        ]);
        if ($validator->fails()) {
            $status = Response::HTTP_BAD_REQUEST;
            $response = ['hata'=>$validator->errors()];
        }else{
            $getuser = User::where("email", $request->email)->first();
            if ($getuser){
                if ($request->sifre and $request->sifre_onay and $request->sifre == $request->sifre_onay){
                    $getuser->email = $request->email;
                    $getuser->password = Hash::make($request->sifre);
                    $getuser->save();
                    $request->user()->token()->revoke();
                    $status = Response::HTTP_OK;
                    $response = ["mesaj"=>"Bilgiler güncellendi. Yeniden Token Almanız gerekmektedie."];
                }else{
                    $status = Response::HTTP_BAD_REQUEST;
                    $response = ['hata' => "Şifreler Eşleşmedi"];
                }
            }else{
                $status = Response::HTTP_NOT_FOUND;
                $response = ['hata' => "Email($request->username) adresine kayıtlı kullanıcı bulunamadı."];
            }
        }
        return response()->json($response, $status);
    }
    public function delete(Request $request){
        $request->user()->token()->revoke();
        return response()->json(["mesaj"=>"çıkış başarılı."], Response::HTTP_OK);
    }
}
