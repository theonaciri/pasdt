<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/consultation';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');

        $this->middleware(function ($request, $next) {
            $this->creator_company = Auth::User()->company_id;
            return $next($request);
        });
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            //'name' => 'required|string|max:255',
            //'email' => 'required|string|email|max:255|unique:users',
            //'password' => 'required|string|min:8|confirmed',
            //'company_id' => 'required'
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        $user = Auth::user();
        if (!$user->su_admin) {
            return view('consultation');
        }
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'company_id' => $data['company'],
            'is_client_company' => !empty($data['is_client_company']),
            'api_token' => Str::random(60)
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = $this->validator($request->all());

        $validator->validate();
        if ($validator->fails()) {
            return redirect($this->redirectPath())
                        ->withErrors($validator)
                        ->withInput();
        }
        event(new Registered($user = $this->create($request->all())));

        
        //$this->guard()->login($user);
        if (Auth::User()->su_admin === 1) {
            $this->redirectTo = "su_admin";
        }
        return $this->registered($request, $user)
                        ? redirect($this->redirectTo) : redirect($this->redirectTo);
    }

    /**
     * Extends register view
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showRegistrationForm(Request $request)
    {
        $user = Auth::user();
        if ($user->is_client_company || $user->su_admin) {
            if ($user->su_admin === 1) {
                $companies = \App\Company::all();
            }
            else{
                $companies = \App\Company::where("id", $user->company_id)->get();
            }            
            return view('auth.register', ['companies'=>$companies]);
        }
        return redirect('consultation');
    }
}
