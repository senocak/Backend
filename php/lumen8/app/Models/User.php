<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;

/**
 * @method static create(array $input)
 * @method static where(string $string, $username)
 */
class User extends Model implements AuthenticatableContract, AuthorizableContract{
    use Authenticatable, Authorizable, HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token',];
    protected $casts = ['email_verified_at' => 'datetime'];
}
