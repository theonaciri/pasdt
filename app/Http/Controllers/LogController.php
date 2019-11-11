<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\User;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(\Illuminate\Http\Request $request)
    {
       // $this->middleware('auth');
        $token = $request->header('Api-Key');
        if (env('API_TOKEN', false) !== $token) {
            abort(403, 'Action non authorisée.');
        }
        $this->user = User::whereApiToken($token)->first();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function storeData()
    {
        return response()->json($this->user);
    }

    public function salut() {
        return 'OKKK';
    }

    /**
     * Get the bearer token from the request headers.
     *
     * @return string|null
    */
    public function bearerToken()
    {
       $header = $this->header('Api-Key', '');
       if (Str::startsWith($header, 'Bearer ')) {
                return Str::substr($header, 7);
       }
    }
}
