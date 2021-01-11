<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\BlogArticle;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;

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
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if ($user->company_id == 0) {
            return view('consultation');
        }
        $company = \App\Company::where('id', $user->company_id)->first();
        if (empty($company)) {
            return view('consultation');
        }
        $this->users = User::where('id', '!=', auth()->id())
                            ->where('company_id', Auth::user()->company_id)
                            ->get();
        return view('auth/admin', ["company"=>$company, "users"=>$this->users]);
        /*} else {
            return view('consultation');
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
            return view('consultation');
        }
        $companies = \App\Company::all();
        $list_modules = \App\Module::select('id', 'name')->whereNull('company_id')->get();
        /*$unlinked_logs = DB::select("
            SELECT cardId, logs.id AS id, logs.created_at, logs.msg
                FROM   logs
                LEFT OUTER JOIN modules
                  ON (logs.cardId = modules.module_id)
            WHERE modules.telit_id IS NULL");*/
        $colors = ["#3490dc", "#6574cd", "#9561e2", "#f66d9b", "#e3342f", "#f6993f", "#ffed4a", "#38c172", "#4dc0b5", "#6cb2eb", "#fff", "#6c757d", "#343a40", "#3490dc", "#6c757d", "#38c172", "#6cb2eb", "#ffed4a", "#e3342f", "#f8f9fa", "#343a40"];
        return view('auth/su_admin', [
            "companies"=>$companies,
            "list_modules"=>$list_modules,
            /*"unlinked_logs"=>$unlinked_logs,*/
            "colors"=>$colors
        ]);
    }

    /**
     * Show the application Whatsnew dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function adminBlogArticles() {
        if (Auth::user()->su_admin !== 1) {
            return view('consultation');
        }
        $whatsnew = DB::table("blog_articles")
                        ->leftJoin('users', 'users.id', '=', 'blog_articles.author')
                        ->select("blog_articles.type", "blog_articles.id", "blog_articles.title", "blog_articles.likes", "blog_articles.created_at",
                        "blog_articles.updated_at", DB::raw("SUBSTRING(blog_articles.text,1, 32) as text"), "users.name", "users.email")->get();
        return view('auth/admin/blogarticles', [
            "blogarticles"=>$whatsnew
        ]);
    }

    /**
     * get blog article html content
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getBlogArticle(BlogArticle $blogArticle) {

        $author = DB::table("users")
                    ->select("name", "email")
                    ->where("id", "=", $blogArticle->author)
                    ->first();
        $blogArticle->author = $author->name;
        $blogArticle->email = $author->email;
        return response()->json($blogArticle);
    }
    
    public function postBlogArticle(Request $request) {
        /*request()->validate([
            'title' => 'required',
            'content' => 'required'
        ]);*/
        $this->getSaveAuthCompany();        
        $blogarticle = new BlogArticle;
        $blogarticle->title = $request->input('article_title', "");
        $blogarticle->type = $request->input('article_type', "ARTICLE");
        $blogarticle->content = $request->input('article_content', "");
        $blogarticle->text = $request->input('article_text', "");
        $blogarticle->author = $this->user->id;
        $blogarticle->locale = $this->user->locale;
        $blogarticle->save();
        return response()->json($blogarticle);
    }
    /**
    * Server-side filtering on users
    **/
    function getUsers(Request $request) {
        $primaryKey = 'id';

        $dt = [
            ['db'=>'id', 'dt'=>0, 'formatter'=>function($value, $model){ return str_pad($value, 8, '0', STR_PAD_LEFT); }],
            ['db'=>'email', 'dt'=>1],
            ['db'=>'name', 'dt'=>2],
            ['db'=>'created_at', 'dt'=>3],
            ['db'=>'email_verified_at']
            //['db'=>'last_name'], // must include this because need to re-use in 'first_name' formatter
        ];
        $dt_obj = new SSP('\App\User', $dt);
        $dt_arr = $dt_obj->getDtArr();
    
        return response()->json($dt_arr);
    }
}
