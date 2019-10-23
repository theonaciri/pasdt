<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;

use Illuminate\Support\Facades\Auth;
class TestViewComposer {

    public function compose(View $view) {
    	$company = null;
    	if (Auth::User()) {
	        $company = \App\Company::where('id', Auth::User()->company_id)->first();
    	}
        $view->with("_company", $company);
    }
}