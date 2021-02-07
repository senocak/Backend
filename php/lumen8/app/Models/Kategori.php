<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, $url)
 * @method static withCount(\Closure[] $array)
 */
class Kategori extends Model{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'id';

    public function yazilar()    {
        return $this->hasMany(Yazi::class);
    }
    // This is for auto increment because i used uuid for id column
    protected static function boot(){
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = \Illuminate\Support\Str::uuid();
            }
        });
    }
    public function getIncrementing(){
        return false;
    }
    public function getKeyType(){
        return 'string';
    }
}
