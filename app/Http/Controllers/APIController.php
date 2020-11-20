<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\Auth;

class APIController extends Controller
{


    public function __construct()
    {
        $this->middleware('auth:api');
    }


    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json($user);
    }
    
   /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */

    public function setColors()
    {
       return '{"OK":"OK"}';
    }
    
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    


    public function bearerToken()
    {
       $header = $this->header('Authorization', '');
       if (Str::startsWith($header, 'Bearer ')) {
           return Str::substr($header, 7);
       }
    }
}