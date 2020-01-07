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

    /**
    * Creates a Module
    * Connexion web
    * @return JSON
    */

    public function postModule(Request $request) {
        $user = Auth::user();
        if ($user->company_id == $request->companyid || $user->su_admin) {
            $module = new Module;
            $module->
            Module::insert
        }

        return response()->json($modules);
    }

    /**
    * Get Modules
    * Connexion web
    */

    public function getAllModules(Request $request) {
        $user = Auth::user();
        $modules = Module::where("company_id", "=", $user->company_id)->select('id, name')->get();

        return response()->json($modules);
    }

    /**
    * Get Module
    * Connexion web
    */

    public function getModule(\App\Module $module) {
        $user = Auth::user();
        if ($module->company_id == $user->company_id) {
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
        if ($module->company_id == $user->company_id) {
            return response($module->telit_json);
        } else {
            return abort(403, "Echec de l'authentification.");
        }
    }
}
