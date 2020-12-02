<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Module;
use App\Company;

class CompanyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function setColors()
    {
        return view('admin');
    }

    /**
     * Returns JSON users of a company.
     *
     * @return \Illuminate\Http\Response
     */


    protected function is_user_allowed($user, $company_id)
    {
        return ($user->company_id == $company_id && $user->is_client_company) || $user->su_admin;
    }

    public function getUsers($company_id)
    {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $company_id)) {
            $users = User::where('company_id', $company_id)->get();
            return response()->json($users);
        } else {
            abort(403);
        }
    }

    /**
     * Returns JSON modules of a company.
     *
     * @return \Illuminate\Http\Response
     */

    public function getModules($company_id)
    {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $company_id)) {
            $modules = Module::where('company_id', $company_id)->get();
            return response()->json($modules);
        } else {
            abort(403);
        }
    }

    /**
     * add a company.
     *
     * @return \Illuminate\Http\Response
     */

    public function createCompany(Request $request)
    {
        $user = Auth::user();
        if (!$user->su_admin) {
            return abort(403);
        }

        $company = Company::create(['name' => $request->name, 'colors' => $request->colors, 'admin_id' => $user->id]);

        if (!empty($request->image)) {
            route('image.upload.post', ['company' => $company->id]);
        }
        return response()->json(["ok" => "ok"]);
    }

    /**
     * Deletes a company if it is empty.
     *
     * @return \Illuminate\Http\Response
     */

    public function deleteCompany($company_id)
    {
        $user = Auth::user();
        if (!$user->su_admin) {
            return abort(403);
        }
        $modules = Module::where('company_id', $company_id)->get();
        $users = User::where('company_id', $company_id)->get();
        if (count($users) || count($modules)) {
            return response()->json(["error" => "error", "modules" => $modules, "users" => $users]);
        }
        \App\Company::destroy($company_id);
        return response()->json(["ok" => "ok"]);
    }

    /**
     * Unlinks a module of a company.
     *
     * @return \Illuminate\Http\Response
     */

    public function unlinkModule(Request $req, Company $company, Module $module)
    {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $company->id)) {
            $module->company_id = NULL;
            $module->save();
            return response()->json($module);
        } else {
            abort(403);
        }
    }

    /**
     * Links a module of a company.
     *
     * @return \Illuminate\Http\Response
     */

    public function linkModule(Request $req, Company $company, Module $module)
    {
        $user = Auth::user();
        if ($this->is_user_allowed($user, $company->id)) {
            $module->company_id = $company->id;
            $module->save();
            return response()->json($module);
        } else {
            abort(403);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function setColorsPost()
    {
        $this->getSaveAuthCompany();
        /*
        request()->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
*/
        $colors = request()->colors;

        $company = \App\Company::where('id', $this->company == -1 ? $this->user->company_id : $this->company)->first();
        $company->colors = $colors;
        $company->save();

        return back()
            ->with('colorsuccess', __("Your color choices have been saved."))
            ->with('colors', $colors)
            ->with('company', $company);
    }
}
