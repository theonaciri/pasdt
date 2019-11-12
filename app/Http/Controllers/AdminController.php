<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;

class AdminController extends Controller
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
     * Show the application admin dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = Auth::user();
        //if (Gate::allows('company-admin')) {
        //if (Auth::user()->is_admin_company) {
            // The current user can edit settings
        if ($user->company_id == 0) {
            return view('home');
        }
        $company = \App\Company::where('id', $user->company_id)->first();
        if (empty($company)) {
            return view('home');
        }
        $this->users = User::where('id', '!=', auth()->id())
                            ->where('company_id', Auth::user()->company_id)
                            ->get();
        return view('auth/admin', ["company"=>$company, "users"=>$this->users]);
        /*} else {
            return view('home');
        }*/
    }

    /**
     * Show the application Su dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function su_admin()
    {
        $user = Auth::user();
        //if (Gate::allows('company-admin')) {
        //if (Auth::user()->is_admin_company) {
            // The current user can edit settings
        if ($user->su_admin !== 1) {
            return view('home');
        }
        $companies = \App\Company::all();
        return view('auth/su_admin', ["companies"=>$companies]);
        /*} else {
            return view('home');
        }*/
    }

    public function deleteUser(\App\User $usertoDelete) {
        $user = Auth::user();
        if ($user->company_id == 0) {
            dd('dead');
            return redirect()->route('home', []);
        }
        dd($usertoDelete->id);
        dd($usertoDelete);
        if ($user->is_admin_company && $user->company_id == $usertoDelete->company_id) {
            $usertoDelete->delete();
        } else {
            return redirect()->route('home', []);
        }
        return redirect()->route('admin', []);
    }
}
