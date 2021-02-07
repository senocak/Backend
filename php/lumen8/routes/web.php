<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/api', function () use ($router) {
    $response = [
        "version"=>$router->app->version(),
        "environment" => $router->app->environment(),
        "isDownForMaintenance" => $router->app->isDownForMaintenance(),
        "getNamespace" => $router->app->getNamespace(),
        "runningUnitTests" => $router->app->runningUnitTests(),
        "runningInConsole" => $router->app->runningInConsole(),
        "eventsAreCached" => $router->app->eventsAreCached(),
        "getLocale" => $router->app->getLocale()
    ];
    return response()->json($response, 200);
});

$router->get('api/yazilar', ['uses' => 'YaziController@getAll']);
$router->get('api/yazi/{url}', ['uses' => 'YaziController@getSingle']);

$router->get('api/kategoriler', ['uses' => 'KategoriController@getAll']);
$router->get('api/kategori/{url}', ['uses' => 'KategoriController@getSingle']);
$router->get('api/kategori/{url}/yazilar', ['uses' => 'KategoriController@getYazilar']);

$router->get('api/yorum/{id}', ['uses' => 'YorumController@getSingle']);
$router->post('api/yorum/ekle', ['uses' => 'YorumController@post']);

$router->post('api/login', ['as' => 'login', 'uses' => 'UsersController@login']);
$router->post('api/register', ['as' => 'register', 'uses' => 'UsersController@register']);

$router->get('api/user', ['middleware' => 'auth', 'uses' => 'UsersController@get']);
$router->patch('api/user', ['middleware' => 'auth', 'uses' => 'UsersController@patch']);
$router->delete('api/user/cikis', ['middleware' => 'auth', 'uses' => 'UsersController@delete']);

$router->post('api/admin/kategori/ekle', ['uses' => 'Admin\KategoriController@post', 'middleware' => 'auth']);
$router->patch('api/admin/kategori/{url}/guncelle', ['uses' => 'Admin\KategoriController@patch', 'middleware' => 'auth']);
$router->delete('api/admin/kategori/{url}/sil', ['uses' => 'Admin\KategoriController@delete', 'middleware' => 'auth']);

$router->post('api/admin/yazi/ekle', ['uses' => 'Admin\YaziController@post', 'middleware' => 'auth']);
$router->patch('api/admin/yazi/{url}/guncelle', ['uses' => 'Admin\YaziController@patch', 'middleware' => 'auth']);
$router->delete('api/admin/yazi/{url}/sil', ['uses' => 'Admin\YaziController@delete', 'middleware' => 'auth']);

$router->patch('api/yorum/{id}/guncelle', ['uses' => 'Admin\YorumController@patch', 'middleware' => 'auth']);

/*
Laravel PATCH and PUT method does not work with form-data, it's known issue of Symfony and even PHP (Google for that - Laravel use many Symfony foundation packages, include Request).


$router->get('{any}', function () use ($router) {
    return view("vue");
});
*/
$router->get('/{any:.*}', function() use ($router) {
    return view("vue");
});
