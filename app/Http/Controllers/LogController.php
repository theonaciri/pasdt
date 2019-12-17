<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\User;
use App\Module;
use App\Log as PasdtLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        $user = Auth::user();

        if ($user->su_admin) {
          $logs = $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.card_number', '=', 'logs.cardId')
                ->select('logs.id', 'modules.module_id as cardId', 'msg', 'modules.telit_customer as customer', 'options', 'logs.created_at', 'logs.updated_at',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        } else {
            $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.card_number', '=', 'logs.cardId')
                ->where('modules.company_id' , '=', $user->company_id)
                ->select('logs.id', 'modules.module_id as cardId', 'msg', 'modules.telit_customer as customer', 'options', 'logs.created_at', 'logs.updated_at',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        }

        return response()->json($logs);
    }

    /**
     * Store single log
     * Connexion API
     */
    public function storeData(Request $request)
    {
        $this->authAPI($request);
        $log = $request->json()->all();
        $log["msg"] = json_encode($log["msg"]);
        $log["options"] = json_encode($log["options"]);
        $newlog = new PasdtLog();
        $newlog->fill($log);
        $newlog->save();
        return response()->json('{"ok": "ok"}');
    }

    protected function authAPI(Request $request) {
        $token = $request->header('Api-Key');
        Log::info('AUTH APIKEY ' . $token);
        Log::info('IP ' . $request->ip());
        Log::info('CONTENT ' . $request->getContent());
        if (env('API_TOKEN', false) !== $token) {
            abort(403, 'Action non authorisée.');
        }
        $this->user = User::whereApiToken($token)->first();
        if (empty($this->user)) {
            abort(403, "Echec de l'authentification.");
        }
    }
}
