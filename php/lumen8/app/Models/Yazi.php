<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, int $int)
 */
class Yazi extends Model{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'id';

    public function kategori(){
        return $this->belongsTo(Kategori::class);
    }
    public function yorum(){
        return $this->hasMany(Yorum::class);
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
