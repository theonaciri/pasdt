<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
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