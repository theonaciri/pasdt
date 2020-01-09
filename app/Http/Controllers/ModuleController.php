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



    protected function is_user_allowed($user, $company_id) {
        return !empty($request->company_id) && ($user->company_id == $company_id && $user->is_client_company) || $user->su_admin;
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
        $module->card_number = $request->pasdt_card_number;
        $module->telit_json = $request->telit_json;
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
                'card_number'=>$request->pasdt_card_number,
                'telit_json'=>$request->telit_json
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
        $module->delete();
        return response()->json($module);
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
