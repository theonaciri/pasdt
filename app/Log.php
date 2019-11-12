<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = ['id', 'cardId', 'msgId', 'msg', 'eventType', 'options'];
}