<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\LogController;

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

    public function index(Request $req)
    {
        return redirect('consultation');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function consultation(Request $req)
    {
        $log = new LogController;
        //return view('home');
        return view('home', [
            "logs" => $log->getData($req, false),
            "synth" => $log->getSynthesisData($req, false)]);
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
