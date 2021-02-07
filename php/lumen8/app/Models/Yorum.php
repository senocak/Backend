<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, $id)
 */
class Yorum extends Model{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'id';

    public function yazi(){
        return $this->belongsTo(Yazi::class);
    }
    public function kategori(){
        return $this->hasOneThrough(Kategori::class,Yazi::class,'id','id','','kategori_id');
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
