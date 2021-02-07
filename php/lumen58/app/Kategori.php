<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model{
    public function yazilar()    {
        return $this->hasMany('App\Yazi');
    }
}
