<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Module;

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

    public function getUsers($company_id)
    {
        $user = Auth::user();
        if (($user->company_id == $company_id && $user->is_client_company) || $user->su_admin) {
            $users = User::where('company_id', $company_id)->get();
            return response()->json($users);
        } else {
            abort(403, "Vous n'avez pas les droits d'accès aux utilisateurs de cette entreprise.");
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
        if (($user->company_id == $company_id && $user->is_client_company) || $user->su_admin) {
            $modules = Module::where('company_id', $company_id)->get();
            return response()->json($modules);
        } else {
            abort(403, "Vous n'avez pas les droits d'accès aux modules de cette entreprise.");
        }
    }
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    
    public function setColorsPost()
    {
        if (!Auth::user()->company_id || !Auth::user()->is_client_company) {
            return view('home');
        }
/*
        request()->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
*/
        $colors = request()->colors;
        
        $company = \App\Company::where('id', Auth::user()->company_id)->first();
        $company->colors = $colors;
        $company->save();

        return back()
            ->with('colorsuccess','Votre couleur a bien sauvegardée.')
            ->with('colors',$colors)
            ->with('company', $company);
    }
}