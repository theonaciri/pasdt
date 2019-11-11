<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\User;
use App\Log;
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
        if (empty($this->user)) {
            abort(403, "Echec de l'authentification.");
        }
    }

    /**
     * Store logs.
     *
     */
    public function storeData(Request $request)
    {
        $log = $request->json()->all();
        $newlog = new Log();
        $newlog->fill($log);
        $newlog->save();
        return response()->json('{"ok": "ok"}');
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
