<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'logo', 'colors', 'admin_id'
    ];

    /*public function admins()
    {
    	return $this->hasMany(Product::class);
    }*/
}
