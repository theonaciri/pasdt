<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\BlogArticle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
    }

    public function index() {
        $whatsnew = DB::table("blog_articles")
                        ->leftJoin('users', 'users.id', '=', 'blog_articles.author')
                        ->select("blog_articles.type", "cover_img", "blog_articles.id", "tags", "blog_articles.title", "blog_articles.likes", "blog_articles.created_at",
                        "blog_articles.updated_at", DB::raw("SUBSTRING(blog_articles.text,1, 32) as text"), "users.name", "users.email")
                        ->orderBy('created_at', 'DESC')->get();
        return view('public_blog', [
            "blogarticles"=>$whatsnew
        ]);
    }

    /**
     * Show the application Whatsnew dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function adminBlogArticles() {
        $this->middleware('auth');
        if (Auth::user()->su_admin !== 1) {
            return view('consultation');
        }
        $whatsnew = DB::table("blog_articles")
                        ->leftJoin('users', 'users.id', '=', 'blog_articles.author')
                        ->select("blog_articles.type", "cover_img", "blog_articles.id", "blog_articles.title", "blog_articles.likes", "blog_articles.created_at",
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
        $this->middleware('auth');
        /*request()->validate([
            'title' => 'required',
            'content' => 'required'
        ]);*/
        $this->getSaveAuthCompany();
        if ($this->user->su_admin !== 1) return abort(403);
        $blogarticle = new BlogArticle;
        $blogarticle->title = $request->input('article_title', "");
        $blogarticle->type = $request->input('article_type', "ARTICLE");
        if (strlen($request->input('article_tags', ""))) {
            $blogarticle->tags = $request->input('article_tags', "");
        }
        $blogarticle->content = $request->input('article_content', "");
        $blogarticle->text = $request->input('article_text', "");
        $blogarticle->author = $this->user->id;
        $blogarticle->locale = $this->user->locale;
        $blogarticle->save();
        return response()->json($blogarticle);
    }

    public function putBlogArticle(Request $request, BlogArticle $blogarticle) {
        $this->middleware('auth');
        /*request()->validate([
            'title' => 'required',
            'content' => 'required'
        ]);*/
        $this->getSaveAuthCompany();    
        if ($this->user->su_admin !== 1) return abort(403);
        $blogarticle->title = $request->input('article_title', "");
        $blogarticle->type = $request->input('article_type', "ARTICLE");
        if (strlen($request->input('article_tags', ""))) {
            $blogarticle->tags = $request->input('article_tags', "");
        }
        $blogarticle->content = $request->input('article_content', "");
        $blogarticle->text = $request->input('article_text', "");
        $blogarticle->save();
        return response()->json($blogarticle);
    }

    public function saveCoverImg(BlogArticle $blogarticle) {
        public_path("blog/".$blogarticle->cover_img);
    }
    public function deleteBlogArticle(BlogArticle $blogarticle) {
        $this->middleware('auth');
        /*request()->validate([
            'title' => 'required',
            'content' => 'required'
        ]);*/
        $this->getSaveAuthCompany();    
        if ($this->user->su_admin !== 1) return abort(403);
        if (file_exists(public_path("blog/" . $blogarticle->cover_img))) {
            unlink(public_path("blog/" . $blogarticle->cover_img));
        }
        $blogarticle->delete();
        return response()->json(Array("ok"=>"ok"));
    }
}