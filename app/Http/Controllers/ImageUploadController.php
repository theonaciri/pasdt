<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\Auth;
use App\BlogArticle;

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
            return view('consultation');
        }

        request()->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imageName = time().'.'.request()->image->getClientOriginalExtension();
        request()->image->move(public_path('images/companylogos'), $imageName);

        $company = \App\Company::where('id', $this->getCompany(Auth::user()))->first();
        $company->logo = $imageName;
        $company->save();

        return back()
            ->with('success-logo', __("Your image have been saved."))
            ->with('image',$imageName)
            ->with('company', $company);
    }
    
    public function blogImageUpload(BlogArticle $blogarticle)
    {
        $this->middleware('auth');
        $this->getSaveAuthCompany();  
        if (Auth::user()->su_admin !== 1) {
            return abort(403);
        }

        request()->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        //$imageName = time().'.'.request()->image->getClientOriginalExtension();
        $imageName = $blogarticle->id.'.'.request()->image->getClientOriginalExtension();
        request()->image->move(public_path('images/blog'), $imageName);

        $blogarticle->cover_img = $imageName;
        $blogarticle->save();

        return back()
            ->with('success-logo', __("Your image have been saved."));
    }
}