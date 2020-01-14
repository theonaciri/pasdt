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
        //$su_company = !empty($_COOKIE['su_company']) ? intval($_COOKIE['su_company']) : NULL;
        $su_company = $request->company ?? NULL;
        $company = $user->su_admin && !empty($su_company) ? $su_company : $user->company_id;
        if ($user->su_admin && is_null($su_company)) {
            $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.card_number', '=', 'logs.cardId')
                ->select('logs.id', 'modules.module_id as cardId', 'msg', 'modules.telit_customer as customer', 'options', 'logs.created_at', 'logs.updated_at',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        } else {
            $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.card_number', '=', 'logs.cardId')
                ->where('modules.company_id' , '=', $company)
                ->select('logs.id', 'modules.module_id as cardId', 'msg', 'modules.telit_customer as customer', 'options', 'logs.created_at', 'logs.updated_at',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        }

        return response()->json($logs);
    }

    /**
    * Get synthesis data
    * Connexion web
    */

    public function getSynthesisData(Request $request) {
        $this->middleware('auth');
        $user = Auth::user();
        if (empty($user)) abort(403);
        //$su_company = !empty($_COOKIE['su_company']) ? intval($_COOKIE['su_company']) : NULL;
        $su_company = $request->company ?? NULL;
        $company = $user->su_admin && !empty($su_company) ? $su_company : $user->company_id;

            $logs = DB::table('logs')
                ->rightJoin('modules', 'card_number', '=', 'logs.cardId')
                ->select('telit_id', 'company_id', 'module_id',
                    'telit_custom1 as part_name', 'telit_custom2 as client_name',
                    'telit_custom3 as info_transfo', 'telit_custom4 as client_name',
                    'telit_customer as customer',
                    'modules.id', 'name as module_name')
                ->groupby('telit_id')
                ->having('modules.company_id' , '=', $company)
                ->get();
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
