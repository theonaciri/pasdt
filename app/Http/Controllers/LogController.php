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
        if (empty($user)) abort(403, "Echec de l'authentification.");
        if (empty($user->company_id)) abort(403, "Pas pu récupérer l'entreprise de l'utilisateur.");
        //$su_company = !empty($_COOKIE['su_company']) ? intval($_COOKIE['su_company']) : NULL;
        $su_company = $request->company ?? NULL;
        $company = !empty($user->su_admin) && $user->su_admin == 1 && !empty($su_company) ? $su_company : $user->company_id;
        if ($user->su_admin && is_null($su_company)) {
            $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.module_id', '=', 'logs.cardId')
                ->select('logs.id', 'cardId','msg', 'modules.telit_customer as customer', 'options',
                         'logs.created_at', 'logs.updated_at', 'logs.maxtemp', 'logs.vbat',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        } else {
            $logs = DB::table('logs')
                ->rightJoin('modules', 'modules.module_id', '=', 'logs.cardId')
                ->where('modules.company_id' , '=', $company)
                ->select('logs.id', 'cardId', 'msg', 'modules.telit_customer as customer', 'options',
                         'logs.created_at', 'logs.updated_at', 'logs.maxtemp', 'logs.vbat',
                         'modules.id as module_id', 'modules.name as module_name')
                ->get();
        }

        return response()->json($logs);
    }


    public function getTempData(Request $request) {
        $this->middleware('auth');
        $user = Auth::user();
        if (empty($user)) abort(403);

        if (/*empty($req->companies) ||*/ empty($user->company_id)) abort(403);
        $modules = Module::/*where("company_id", "=", $user->company_id)*/
            select('company_id', 'name', 'module_id')
            ->get()->toArray();
        $modules_list = array_column($modules, 'module_id');
        $from = !empty($request->input('from')) ? date("Y-m-d H:i:s", strtotime($request->input('from'))) : date("Y-m-d 00:00:00", strtotime('-3 days'));
        $to = date("Y-m-d 23:59:59");
        // check dates ?
        $temps = DB::table('logs')
                    ->select('cardId', 'maxtemp', 'created_at')
                    ->whereDate('created_at', '>', $from)
                    ->whereDate('created_at', '<=', $to)
                    //->whereBetween('created_at', [$from, $to])
                    ->whereIn('cardId', $modules_list)
                    ->whereNotNull('maxtemp')
                    ->where('maxtemp', '!=', '-99')
                    ->where('maxtemp', '!=', '785')
                    ->get();
        $res = [
            'temps'  => $temps,
            'modules'=> $modules,
            'modules_list'=> $modules_list,
            'to'     => $to,
            'from'   => $from
        ];
        return response()->json($res);

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

        $company = $user->company;
        if ($user->su_admin) {
            $company = intval($request->company) ?? -1;
        } else {
            $company = intval($user->company->id) ?? -1;
        }
        $company_condition = $company > 0 ? "AND company_id = $company" : "";

        // alerts without temps
        $alerts_array = DB::select(DB::raw(<<<EOTSQL
            SELECT name, module_id, msg, maxtemp, logs.created_at FROM logs
            LEFT JOIN modules ON modules.module_id = logs.cardId 
            WHERE logs.id IN (
            SELECT MAX(L.id) FROM logs L
            LEFT JOIN modules ON modules.module_id = L.cardId
            WHERE msg != '["DAY"]' AND msg != '["ACK"]' AND msg != '["HOUR"]'
                $company_condition
            GROUP BY modules.module_id)
EOTSQL));

        /*
        $lastemps_array = DB::select(DB::raw(<<<EOTMAXSQL
                    SELECT cardId, maxtemp
                    FROM logs
                    WHERE maxtemp IS NOT NULL AND maxtemp < 785 AND maxtemp > -99;
EOTMAXSQL));
*/


        $lastemps_array = DB::select(DB::raw(<<<EOTSQL
            SELECT name, module_id, msg, maxtemp, logs.created_at AS temp_created_at FROM logs
            LEFT JOIN modules ON modules.module_id = logs.cardId
            WHERE maxtemp IS NOT NULL AND maxtemp < 785 AND maxtemp > -99
                AND logs.id IN (
                SELECT MAX(L.id) FROM `logs` L
                LEFT JOIN modules ON modules.module_id = L.cardId
                    $company_condition
            GROUP BY modules.module_id)
EOTSQL));

            //$res = array_merge($alerts_array, $lastemps_array);
            foreach ($lastemps_array as $key => $temp) {
                foreach ($alerts_array as $_key => $alert) {
                    if ($alert->module_id == $temp->module_id) { // temps with alerts
                        $alert->maxtemp = $temp->maxtemp;
                        $alert->temp_created_at = $temp->temp_created_at;
                        break;
                    }
                    if ($_key === array_key_last($alerts_array)) { // temps without alerts
                        array_push($alerts_array, $temp);
                    }
                }
            }
        return response()->json($alerts_array);
        //return response()->json($othermodules);
    }

    /**
     * Store single log
     * Connexion API
     */
    public function storeData(Request $request)
    {
        $this->authAPI($request);
        $log = $request->json()->all();
        $log["cardId"] = $this->convertIdPasdtToTelit($log["cardId"]);
        $log["msg"] = json_encode($log["msg"]);
        $log["options"] = json_encode($log["options"]);
        $json = json_decode($log["options"]);
        $log["maxtemp"] = isset($json->maxtemp) ? intval($json->maxtemp) : NULL;
        $log["vbat"] = isset($json->vbat) ? $json->vbat : NULL;
        $newlog = new PasdtLog();
        $newlog->fill($log);
        $newlog->save();

        if (is_null(Module::where('module_id', '=', $log["cardId"])->first())) {
            $module = new Module;
            $module->name = '--';
            $module->company_id = 1;
            $module->telit_json = '{}';
            $module->module_id = $log["cardId"];
            $module->telit_id = '';
            $module->save();

        }
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

    public function convertIdPasdtToTelit($pasdt_str) {
        // 002306224 -> 1850-00035
        if (strlen($pasdt_str) != 9) return NULL;
        $serial = substr($pasdt_str, 0, 4);
        $datecode = substr($pasdt_str, 5, 9);
        return str_pad(dechex($datecode), 4, '0', STR_PAD_LEFT)
            . '-'
            . str_pad(hexdec($serial), 5, '0', STR_PAD_LEFT);
    }
}
