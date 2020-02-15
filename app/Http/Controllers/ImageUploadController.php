<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\Auth;

class ImageUploadController extends Controller
{
   /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */

    public function imageUpload()
    {
       return view('admin');
    }
    
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    
    public function imageUploadPost()
    {
        if (!Auth::user()->company_id || !Auth::user()->is_client_company) {
            return view('home');
        }

        request()->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imageName = time().'.'.request()->image->getClientOriginalExtension();
        request()->image->move(public_path('images/companylogos'), $imageName);

        $company = \App\Company::where('id', Auth::user()->company_id)->first();
        $company->logo = $imageName;
        $company->save();

        return back()
            ->with('success','Votre image a bien été sauvegardée.')
            ->with('image',$imageName)
            ->with('company', $company);
    }
}