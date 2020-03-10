<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = ['cardId', 'msgId', 'msg', 'eventType', 'options', 'maxtemp', 'vbat'];
}
