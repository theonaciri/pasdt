<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\User;
use App\Notification;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;
use App\Http\Controllers\NotificationController;

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
    public function index(Request $request)
    {
        $user = Auth::user();
        //if (Gate::allows('company-client')) {
        //if (Auth::user()->is_client_company) {
            // The current user can edit settings
        if (empty($user) || empty($user->company_id) || $user->company_id == 0) {
            return view('consultation');
        }
        $su_company = $request->company ?? NULL;
        $id_company = $user->company_id;
        if (!empty($user->su_admin) && $user->su_admin == 1 && !empty($su_company)) {
          $id_company = $su_company;
        }
        $company = \App\Company::where('id', $id_company)->first();
        if (empty($company)) {
            return view('consultation');
        }
        $this->modules = \App\Module::where('company_id', $id_company)->get();
        //$modulesids = $this->modules->pluck('module_id')->toArray();
        $this->subscriptions = \App\Subscription::where('user_id', $user->id)->get();
        $this->users = User::where('id', '!=', auth()->id())
                           ->where('company_id', $id_company)
                           ->get();
        $notifs = NotificationController::getNotifs($request);
        $official_locales = array("en_US" => "English", "es_ES" => "Español", "fr_FR" => "Français",
                                  "de_DE" => "German (Germany)", "nl_NL" => "Dutch (Netherlands)", "it_IT" => "Italiano");
        $locales = array("ar_MA"=>"Arabic (Morocco)", "az_Cyrl_AZ"=>"Azerbaijani (Cyrillic, Azerbaijan)", "be_BY"=>"Belarusian (Belarus)",
                         "bg_BG" => "Bulgarian", "bn_BD" => "Bengali (bangladesh)", "bs_CYRL_ba" => "Bosnian (Bosnia and Herzegovina)",
                         "ca_ES" => "Catalan (Spain)", "cs_CZ" => "Czech (Czech Republic)", "cy_GB" => "Welsh (United Kingdom)",
                         "da_DK" => "Danish (Denmark)", "de_CH" => "German (Switzerland)",
                         "el_GR" => "Greek (Greece)", "et_EE" => "Estonian (Estonia)", "eu_ES" => "Basque (Spain)", "fa_IR" => "Persian (Iran)",
                         "fi_FI" => "Finnish (Finland)", "fil_PH" => "Filipino (Philippines)", "gl_ES" => "Galician (Spain)", "he_IL" => "Hebrew (Israel)",
                         "hi_IN" => "Hindi (India)", "hr_HR" => "Croatian (Croatia)", "hu_HU" => "Hungarian (Hungary)", "hy_AM" => "Armenian (Armenia)",
                         "id_ID" => "Indonesian (Indonesia)", "is_IS" => "Icelandic (Iceland)", "ja_JP" => "Japanese (Japan)", "ka_GE" => "Georgian (Georgia)",
                         "kk" => "Kazakh (Kazakhstan)", "km_KH" => "Khmer (Cambodia)", "kn_IN" => "Kannada (India)", "ko_KR" => "Korean (South Korea)",
                         "lt_LT" => "Lithuanian (Lithuania)", "lv_LV" => "Latvian (Latvia)", "mk_MK" => "Macedonian (Macedonia)", "mr_IN" => "Marathi (India)",
                         "ms_MY" => "Malay (Malaysia)", "nb_NO" => "Norwegian Bokmål (Norway)", "ne_NP" => "Nepali (Nepal)",
                         "nn_NO" => "Norwegian Nynorsk (Norway)", "pl_PL" => "Polish (Poland)", "ps_AF" => "Pashto (Afghanistan)", "pt_BR" => "Portuguese (Brazil)",
                         "pt_PT" => "Portuguese (Portugal)", "ro_RO" => "Romanian (Romania)", "ru_RU" => "Russian (Russia)","si_LK" => "Sinhala (Sri Lanka)",
                         "sk_SK" => "Slovak (Slovakia)", "sl_SI" => "Slovenian (Slovenia)", "sq_AL" => "Albanian (Albania)", "sr_Cyrillic" => "Serbian (Cyrillic)",
                         "sr_Latin" => "Servian (Latin)", "sv_SE" => "Swedish (Sweden)", "sw_KE" => "Swahili (Kenya)", "th_TH" => "Thai (Thailand)",
                         "tr_TR" => "Turkish (Turkey)", "uk_UA" => "Ukrainian (Ukraine)", "ur_PK" => "Urdu (Pakistan)", "uz_CYRL_UZ" => "Uzbek (Cyrillic, Uzbekistan)",
                         "uz_LATN_UZ" => "Uzbek (Latin, Uzbekistan)", "vi_VN" => "Vietnamese (Vietnam)", "zh_CN" => "Chinese (Simplified Han, China)",
                         "zh_HK" => "Chinese (Simplified Han, Hong Kong SAR China)", "zh_TW" => "Chinese (Traditional Han, Taiwan)");
        return view('auth/client', [
          "user" => $user,
          "company" => $company,
          "modules" => $this->modules,
          "subscriptions" => $this->subscriptions,
          "users" => $this->users,
          "notifs" => $notifs,
          "official_locales" => $official_locales,
          "locales" => $locales,
          "phplocale" => $user->locale
        ]);
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
        return view('auth/su_admin', ["companies"=>$companies]);
        /*} else {
            return view('consultation');
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
            return view('consultation');
        }
        $companies = \App\Company::all();
        return view('auth/checkout', ["companies"=>$companies]);
        /*} else {
            return view('consultation');
        }*/
    }

    public function toggleMailNotifs(int $activation) {
      $this->getSaveAuthCompany();
      $this->user->receive_mails = $activation == 1;
      $this->user->save();
      return $this->user->receive_mails ? 1 : 0;
    }

    public function changeLocale() {
      request()->validate([
          'locale' => 'required',
      ]);

      $this->getSaveAuthCompany();
      $this->user->locale = request()->locale;
      $this->user->save();
      app()->setLocale($this->user->locale);
      return back()
          ->with('success-locale', __("Your language preferences have correctly been updated"))
          ->with('locale',$this->user->locale);
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
            return view('consultation');
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
            return redirect()->route('consultation', []);
        }
        dd($usertoDelete->id);
        dd($usertoDelete);
        if ($user->is_client_company && $user->company_id == $usertoDelete->company_id) {
            $usertoDelete->delete();
        } else {
            return redirect()->route('consultation', []);
        }
        return redirect()->route('client', []);
    }
 
    public function modifUser($usertoModif) {
        $authUser = Auth::user();
        if ($authUser->company_id == 0) {
            return redirect()->route('consultation', []);
        }
        $usertoModif = User::find($usertoModif);
        if ($authUser->is_client_company
          && $authUser->company_id 
          == $usertoModif->company_id) {
            $usertoModif->name = request('name');
            $usertoModif->email = request('email');
            $usertoModif->password = Hash::make(request('password'));

            $usertoModif->save();
        }
        else{
            abort(403);
        }
        return response()->json($usertoModif);
    }
}
