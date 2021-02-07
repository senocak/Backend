<?php
$router->get('/version', function () use ($router) {
    return $router->app->version();
});
$router->post('/auth/login', 'UserController@postLogin');
$router->group(['middleware' => 'auth'], function ($router) {
    $router->get('/deneme', 'UserController@deneme');
});
$router->get("/","YaziController@index");
//$router->get("/[/{page}]","YaziController@index");
$router->get("/sayfa[/{page}]","YaziController@sayfa_index");
$router->get("/kategoriler/index","KategoriController@index");
$router->get("/yorumlar/index","YorumController@index");