<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
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
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(Request $req)
    {
        return view('home');
    }

    /**
     * If user is auth, go home, or log
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function redirect(Request $req)
    {
        return view('home');
    }
}
