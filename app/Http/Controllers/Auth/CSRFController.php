<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class CSRFController extends Controller
{
    public function refresh() {
        //session()->regenerate();
        return response()->json(["token"=>csrf_token()], 200);
    }
}
