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
use Illuminate\Support\Facades\Storage;

class ModuleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
       $this->middleware('auth');
    }


    public function index(Request $request) {
        $user = Auth::user();
        //if (Gate::allows('company-admin')) {
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if ($user->su_admin !== 1) {
            return view('home');
        }
        $companies = \App\Company::all();
        $modules = \App\Module::select("*")
                    ->rightJoin('company', 'modules.company_id', '=', 'company.id');
        $list_modules = \App\Module::select('id', 'name')->whereNull('company_id')->get();
        /*$unlinked_logs = DB::select("
            SELECT cardId, logs.id AS id, logs.created_at, logs.msg
                FROM   logs
                LEFT OUTER JOIN modules
                  ON (logs.cardId = modules.module_id)
            WHERE modules.telit_id IS NULL");*/
        $colors = ["#3490dc", "#6574cd", "#9561e2", "#f66d9b", "#e3342f", "#f6993f", "#ffed4a", "#38c172", "#4dc0b5", "#6cb2eb", "#fff", "#6c757d", "#343a40", "#3490dc", "#6c757d", "#38c172", "#6cb2eb", "#ffed4a", "#e3342f", "#f8f9fa", "#343a40"];
        return view('auth/module', [
            "companies"=>$companies,
            "list_modules"=>$list_modules,
            "modules"=>$modules,
            /*"unlinked_logs"=>$unlinked_logs,*/
            "colors"=>$colors
        ]);
    }

    protected function is_user_allowed($user, $company_id) {
        return !empty($request->company_id) && ($user->company_id == $company_id && $user->is_client_company) || $user->su_admin;
    }

    protected function getSessionTelit($force_reconnect = false) {
        // curl --data-urlencode 'username=username' --data-urlencode 'password=password' 'https://api-de.devicewise.com/rest/auth/'
        if (!$force_reconnect && !empty(env('TELIT_SESSION_ID'))) {
            return env('TELIT_SESSION_ID');
        } else if (!$force_reconnect && Storage::exists(env('TELIT_SESSION_ID_PATH'))) {
            return Storage::get(env('TELIT_SESSION_ID_PATH'));
        } // else
        $arr=array(
            'username' => env('TELIT_USERNAME'),
            'password' => env('TELIT_PASSWORD')
         );
        $data_string = http_build_query($arr);
        $ch = curl_init("https://api-de.devicewise.com/rest/auth/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/x-www-form-urlencoded"));
        $final = curl_exec($ch);
        config(['TELIT_SESSION_ID' => $final]);
        Storage::put(env('TELIT_SESSION_ID_PATH'), $final);
        return $final;
    }

    /**
    ** Returns connection data, given iccid
    ** Connexion web
    ** @return JSON
    **/

    public function getTelitJson($telit_id) {
        $session = $this->getSessionTelit();
        $arr=array(
            "sessionId" => $session,
            "iccid" => $TELIT_SESSION_ID
         );
        $data_string = http_build_query($arr);
        $ch = curl_init("https://api-de.devicewise.com/rest/_/cdp.connection.find/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/x-www-form-urlencoded"));
        $final = curl_exec($ch);
        return $this->checkIfNotDisconnected($final, $ch, $arr);
    }


    /**
    ** To call after each Telit API calls. If we are disconnected, it relogs and sends the call again.
    ** @return String
    **/
    protected function checkIfNotDisconnected($final, $ch, $arr) {
        $res = json_decode($final);
        if (!empty($res) && $res->success == false && $res->errorCodes[0] == -90000) {
            $session = $this->getSessionTelit(true);
            $arr["sessionId"] = $session;
            $data_string = http_build_query($arr);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
            $final = curl_exec($ch);
        }
        return response($final);
    }

    /**
    ** Returns list of connections ordered by more recently activated, given limit
    ** Connexion web
    ** @return JSON
    **/

    protected function _getTelitListConnections($limit) {
        $session = $this->getSessionTelit();
        $arr=array(
            "sessionId" => $session,
            "sort" => "-dateActivated",
            "offset"=>"0",
            "limit"=> strval($limit)
         );
        $data_string = http_build_query($arr)   ;
        $ch = curl_init("https://api-de.devicewise.com/rest/_/cdp.connection.list/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/x-www-form-urlencoded"));
        $final = curl_exec($ch);
        return $this->checkIfNotDisconnected($final, $ch, $arr);
    }

    /**
    ** Returns list of connections ordered by more recently activated, given limit
    ** Connexion web
    ** @return JSON
    **/

    public function getTelitListConnections($limit) {
        return response($this->_getTelitListConnections($limit));
    }

    /**
    ** Returns list of connections ordered by more recently activated, given limit
    ** Connexion web
    ** @return JSON
    **/

    public function saveTelitListConnections($limit) {
        return response($this->_getTelitListConnections($limit));
    }

    /**
    ** Returns list of connections ordered by more recently activated, given limit
    ** Connexion web
    ** @return JSON
    **/

    public function saveTelitModules() {
        $_modules = $this->_getTelitListConnections(5);
        $modules = json_decode($_modules);
        dd($_modules);
        foreach ($modules as $key => $module) {
            DB::table('modules')
                ->updateOrInsert(
                    ['telit_id' => $module->icci],
                    [
                        'company_id' => 0,
                        'name' => $module->configName,
                        'telit_id' => $module->iccid,
                        'module_id' => $module->custom1,
                        'telit_customer' => $module->customer,
                        'telit_status'=> $module->status,
                        'telit_imei'=> $module->imei,
                        'telit_msisdn'=> $module->msisdn,
                        'telit_ratePlan'=> $module->ratePlan,
                        'telit_dateActivated'=> $module->dateActivated,
                        'telit_dateModified'=> $module->dateModified,
                        'telit_custom1'=> $module->custom1,
                        'telit_custom2'=> $module->custom2,
                        'telit_custom3'=> $module->custom3,
                        'telit_custom4'=> $module->custom4,
                        'telit_locLat'=> $module->locLat,
                        'telit_locLon'=> $module->locLng,
                        'telit_locAdress'=>json_encode($module->locAdress),
                        'telit_json'=>json_encode($module)
                    ]
                );
        }
        return response('OK');
    }

    /**
    ** Returns list of connections ordered by more recently activated, given limit
    ** Connexion web
    ** @return JSON
    **/

    public function LookupTelitFromId($id) {

        return response($final);
    }

    /**
    * Creates a Module
    * Connexion web
    * @return JSON
    */

    public function postModule(Request $request) {
        $user = Auth::user();
        $module = new Module;
        $module->name = $request->name;
        if ($this->is_user_allowed($user, $request->company_id)) {
            $module->company_id = $request->company_id;
        }
        $module->telit_json = $request->telit_json;
        $module->telit_id = $request->telit_number;
        $module->module_id = $request->pasdt_module_number;
        $module->save();

        return response()->json($module);
    }

    /**
    * Edits a Module
    * Connexion web
    * @return JSON
    */

    public function putModule(Request $request, Module $module) {
        $user = Auth::user();
        $module->name = $request->name;
        if ($this->is_user_allowed($user, $module->company_id)) {
            $module->update([
                'name'=>$request->name,
                'telit_json'=>$request->telit_json,
                'telit_id'=>$request->telit_number,
                'module_id'=>$request->pasdt_module_number
            ]);
        } else {
            abort(403, "Vous n'avez pas les droits d'accès aux modules de cette entreprise.");
        }

        return response()->json($module);
    }

    /**
    * Deteles a Module
    * Connexion web
    * @return JSON
    */

    public function deleteModule(Module $module) {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $module->company_id)) {
            $module->delete();
            return response()->json($module);
        } else {
            return abort(403, "Echec de l'authentification.");
        }
    }

    /**
    * Get Modules
    * Connexion web
    */

    public function getAllModules(Request $request) {
        $user = Auth::user();
        $modules = Module::where("company_id", "=", $user->company_id)->select('id', 'name')->get();
        return response()->json($modules);
    }

    /**
    * Get Module
    * Connexion web
    */

    public function getModule(\App\Module $module) {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $module->company_id)) {
            return response()->json(json_decode($module->telit_json));
        } else {
            return abort(403, "Echec de l'authentification.");
        }
    }

    /**
    * Get Module
    * Connexion web
    */

    public function getModuleJson(Module $module) {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $module->company_id)) {
            return response($module->telit_json);
        } else {
            return abort(403, "Echec de l'authentification pour récupérer les données JSON.");
        }
    }
}
