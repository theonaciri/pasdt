<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;

class ClientController extends Controller
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
     * Show the application client dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = Auth::user();
        //if (Gate::allows('company-client')) {
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if ($user->company_id == 0) {
            return view('home');
        }
        $company = \App\Company::where('id', $user->company_id)->first();
        if (empty($company)) {
            return view('home');
        }
        $this->modules = \App\Module::where('company_id', $user->company_id)->get();
        $this->subscriptions = \App\Subscription::where('user_id', $user->id)->get();
        $this->users = User::where('id', '!=', auth()->id())
                            ->where('company_id', Auth::user()->company_id)
                            ->get();
        return view('auth/client', ["company"=>$company, "modules"=>$this->modules, "subscriptions"=>$this->subscriptions, "users"=>$this->users]);
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
        //if (Auth::user()->is_client_company) {
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
    /**
     * Show the application Su dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function checkout()
    {
        $user = Auth::user();
        //if (Gate::allows('company-admin')) {
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if ($user->su_admin !== 1) {
            return view('home');
        }
        $companies = \App\Company::all();
        return view('auth/checkout', ["companies"=>$companies]);
        /*} else {
            return view('home');
        }*/

    }    
    /**
     * Show the application Su dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function addSub(Request $req)
    {
        $user = Auth::user();
        \Stripe\Stripe::setApiKey(env("STRIPE_SECRET"));
        //if (Gate::allows('company-admin')) {
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if ($user->su_admin !== 1) {
            return view('home');
        }
        $companies = \App\Company::all();
        $customer = \Stripe\Customer::create([
          "payment_method" => $req->input('payment_method'),
          "email" => $req->input('email'),
          "invoice_settings" => [
            "default_payment_method" => $req->input('payment_method')
          ]
        ]);

        $subscription = \Stripe\Subscription::create([
          "customer" => $customer->id,
          "items" => [
            [
              "plan" => "plan_CBb6IXqvTLXp3f",
            ],
          ],
          "expand" => ['latest_invoice.payment_intent']
        ]);
        return response()->json($subscription);
    }

    public function deleteUser(\App\User $usertoDelete) {
        $user = Auth::user();
        if ($user->company_id == 0) {
            dd('dead');
            return redirect()->route('home', []);
        }
        dd($usertoDelete->id);
        dd($usertoDelete);
        if ($user->is_client_company && $user->company_id == $usertoDelete->company_id) {
            $usertoDelete->delete();
        } else {
            return redirect()->route('home', []);
        }
        return redirect()->route('client', []);
    }
}
