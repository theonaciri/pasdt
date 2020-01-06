<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
class TestViewComposer {

    public function compose(View $view) {
    	$company = null;
    	$modules = null;
        $su_applied = false;
    	if (Auth::User()) {
            if (Auth::user()->su_admin && request()->company) {
                $company = \App\Company::where('id', request()->company)->first();
                $su_applied = true;
            }
            if (empty($company)) {
    	        $company = \App\Company::where('id', Auth::User()->company_id)->first();
            }
	        $modules = \App\Module::where('company_id', $company->id)->get();
    	}
        $view   ->with("_company", $company)
        	    ->with("self", Auth::User())
        		->with("_modules", $modules)
                ->with("su_applied", $su_applied);
    }
}