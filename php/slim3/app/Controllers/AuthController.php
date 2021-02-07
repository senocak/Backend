<?php
namespace App\Controllers;
use App\Models\User;
use Respect\Validation\Validator as Validator;
class AuthController extends Controller{
    public function getKayıt($request, $response){
        return $this->view->render($response,"auth.twig");
    }
    public function postKayıt($request, $response){
        $validaton = $this->validator->validate($request,[
            "name"=>Validator::notEmpty(),
            "email"=>Validator::noWhiteSpace()->notEmpty()->email()->emailAvailable(),
            "password"=>Validator::noWhiteSpace()->notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("auth"));
        }
        $email=$request->getParam("email");
        $name=$request->getParam("name");
        $password=$request->getParam("password");
        $user = User::create([
            "name"=>$name,
            "email"=>$email,
            "password"=>password_hash($password,PASSWORD_DEFAULT),
        ]);
        $this->auth->attempt($email, $password);
        $this->flash->addMessage("info","Kayıt oldunuz.");
        return $response->withRedirect($this->router->pathFor("index"));
    }
    public function postGiris($request, $response){
        $validaton = $this->validator->validate($request,[
            "email_login"=>Validator::noWhiteSpace()->notEmpty()->email(),
            "password_login"=>Validator::noWhiteSpace()->notEmpty(),
        ]);
        if ($validaton->failed()) {
            $this->flash->addMessage("error","Tüm Alanları Doldurunuz.");
            return $response->withRedirect($this->router->pathFor("auth"));
        }
        $auth = $this->auth->attempt($request->getParam("email_login"),$request->getParam("password_login"));
        if (!$auth) {
            $this->flash->addMessage("error","Kullanıcı Adı veya Şifre Yanlış");
            return $response->withRedirect($this->router->pathFor("auth"));
        }
        $this->flash->addMessage("info","Giriş Başarılı.");
        return $response->withRedirect($this->router->pathFor("index"));
    }
    public function cikis($request, $response){
        $this->auth->logout();
        $this->flash->addMessage("info","Çıkış Başarılı.");
        return $response->withRedirect($this->router->pathFor("index"));
    }
    public function getSifreDegistir($request, $response){
        return $this->view->render($response,"sifre.twig");
    }
    public function postSifreDegistir($request, $response){
        $validaton = $this->validator->validate($request,[
            "password_old_change"=>Validator::noWhiteSpace()->notEmpty()->matchesPassword($this->auth->user()->password),
            "password_new_change"=>Validator::noWhiteSpace()->notEmpty(),
        ]);
        if ($validaton->failed()) {
            return $response->withRedirect($this->router->pathFor("auth.getSifreDegistir"));
        }
        $this->auth->user()->setPassword($request->getParam("password_new_change"));
        $this->flash->addMessage("info","Şifre Değiştirildi.");
        return $response->withRedirect($this->router->pathFor("index"));
    }
}