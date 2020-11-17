<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestViewComposer {

    public function compose(View $view) {
        $locale = "en_US";
    	$company = null;
    	$modules = null;
        $su_applied = false;
        $user = Auth::User();
    	if ($user) {
            $locale = $user->locale;
            app()->setLocale($locale);
            if ($user->su_admin && request()->company) {
                $company = \App\Company::where('id', request()->company)->first();
                $su_applied = true;
            }
            if (empty($company)) {
    	        $company = \App\Company::where('id', $user->company_id)->first();
            }
	        $modules = \App\Module::where('company_id', $company->id)->get();
    	}
        $view   ->with("_company", $company)
        	    ->with("self", $user)
        		->with("_modules", $modules)
                ->with("su_applied", $su_applied)
                ->with("locale", strtolower(str_replace('_', '-', $locale)));
    }
}