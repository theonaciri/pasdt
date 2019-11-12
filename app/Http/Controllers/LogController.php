<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\User;
use App\Log as PasdtLog;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
       // $this->middleware('auth');
    }

    /**
    * Get data
    * Connexion web
    */

    public function getAllData(Request $request) {
        $this->middleware('auth');
        return response()->json(PasdtLog::all());
    }

    /**
     * Store single log
     * Connexion API
     */
    public function storeData(Request $request)
    {
        $this->authAPI($request);
        $log = $request->json()->all();
        $newlog = new PasdtLog();
        $newlog->fill($log);
        $newlog->save();
        return response()->json('{"ok": "ok"}');
    }

    protected function authAPI(Request $request) {
        $token = $request->header('Api-Key');
        Log::info('AUTH APIKEY ' . $token);
        if (env('API_TOKEN', false) !== $token) {
            abort(403, 'Action non authorisée.');
        }
        $this->user = User::whereApiToken($token)->first();
        if (empty($this->user)) {
            abort(403, "Echec de l'authentification.");
        }
    }
}
