<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'telit_json', 'telit_id', 'module_id'
    ];

    public function temps()
    {
        return $this->hasMany('Log.php', 'cardId', 'module_id');
    }
}
