<?php
namespace App\Middleware;
class AuthMiddleware extends Middleware{
    public function __invoke($request, $response, $next){
        if (!$this->container->auth->check()) {
            $this->container->flash->addMessage("error","Giriş Yapmak Zorundasınız.");
            return $response->withRedirect($this->container->router->pathFor("auth"));
        }
        $response = $next($request, $response);
        return $response;
    }
}