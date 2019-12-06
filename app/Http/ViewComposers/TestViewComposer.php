<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;

use Illuminate\Support\Facades\Auth;
class TestViewComposer {

    public function compose(View $view) {
    	$company = null;
    	$modules = null;
    	if (Auth::User()) {
	        $company = \App\Company::where('id', Auth::User()->company_id)->first();
	        $modules = \App\Module::where('company_id', Auth::User()->company_id)->get();
    	}
        $view   ->with("_company", $company)
        	    ->with("self", Auth::User())
        		->with("_modules", $modules);
    }
}