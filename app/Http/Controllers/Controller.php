<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use App\User;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected static function getCompany(User $user) {
        if (empty($user)) abort(403, __("Authentication failed."));
        if (empty($user->company_id)) abort(403, __("Unable to retrieve user's company information."));
        app()->setLocale($user->locale);
        if (!empty($user->su_admin) && $user->su_admin == 1) {
            if (!empty(request()->company)) {
                return request()->company;
            }
            return -1;
        }
        return $user->company_id;
    }

    protected static function getAuthCompany() {
        $user = Auth::user();
        return Controller::getCompany($user);
    }

    protected function getSaveAuthCompany() {
        $this->user = Auth::user();
        $this->company = Controller::getCompany($this->user);
        return $this->company;
    }
}
