<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\User;
use App\Module;
use App\Notification;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;
use App\Http\Controllers\NotificationController;

class ClientController extends Controller
{
    const OFFICIAL_LOCALES = '{"en_US":"English (US)","es_ES":"Espa\u00f1ol (Spain)","fr_FR":"Fran\u00e7ais (France)","de_DE":"Deutsche (Germany)","nl_NL":"Dutch (Netherlands)","it_IT":"Italiano (Italy)"}';
    const LOCALES = '{"ar_MA":"Arabic (Morocco)","az_Cyrl_AZ":"Azerbaijani (Cyrillic, Azerbaijan)","be_BY":"Belarusian (Belarus)","bg_BG":"Bulgarian (Bulgaria)","bn_BD":"Bengali (bangladesh)","bs_CYRL_ba":"Bosnian (Bosnia and Herzegovina)","ca_ES":"Catalan (Spain)","cs_CZ":"Czech (Czech Republic)","cy_GB":"Welsh (United Kingdom)","da_DK":"Danish (Denmark)","de_CH":"German (Switzerland)","el_GR":"Greek (Greece)","et_EE":"Estonian (Estonia)","eu_ES":"Basque (Spain)","fa_IR":"Persian (Iran)","fi_FI":"Finnish (Finland)","fil_PH":"Filipino (Philippines)","gl_ES":"Galician (Spain)","he_IL":"Hebrew (Israel)","hi_IN":"Hindi (India)","hr_HR":"Croatian (Croatia)","hu_HU":"Hungarian (Hungary)","hy_AM":"Armenian (Armenia)","id_ID":"Indonesian (Indonesia)","is_IS":"Icelandic (Iceland)","ja_JP":"Japanese (Japan)","ka_GE":"Georgian (Georgia)","kk":"Kazakh (Kazakhstan)","km_KH":"Khmer (Cambodia)","kn_IN":"Kannada (India)","ko_KR":"Korean (South Korea)","lt_LT":"Lithuanian (Lithuania)","lv_LV":"Latvian (Latvia)","mk_MK":"Macedonian (Macedonia)","mr_IN":"Marathi (India)","ms_MY":"Malay (Malaysia)","nb_NO":"Norwegian Bokm\u00e5l (Norway)","ne_NP":"Nepali (Nepal)","nn_NO":"Norwegian Nynorsk (Norway)","pl_PL":"Polish (Poland)","ps_AF":"Pashto (Afghanistan)","pt_BR":"Portuguese (Brazil)","pt_PT":"Portuguese (Portugal)","ro_RO":"Romanian (Romania)","ru_RU":"Russian (Russia)","si_LK":"Sinhala (Sri Lanka)","sk_SK":"Slovak (Slovakia)","sl_SI":"Slovenian (Slovenia)","sq_AL":"Albanian (Albania)","sr_Cyrillic":"Serbian (Cyrillic)","sr_Latin":"Servian (Latin)","sv_SE":"Swedish (Sweden)","sw_KE":"Swahili (Kenya)","th_TH":"Thai (Thailand)","tr_TR":"Turkish (Turkey)","uk_UA":"Ukrainian (Ukraine)","ur_PK":"Urdu (Pakistan)","uz_CYRL_UZ":"Uzbek (Cyrillic, Uzbekistan)","uz_LATN_UZ":"Uzbek (Latin, Uzbekistan)","vi_VN":"Vietnamese (Vietnam)","zh_CN":"Chinese (Simplified Han, China)","zh_HK":"Chinese (Simplified Han, Hong Kong SAR China)","zh_TW":"Chinese (Traditional Han, Taiwan)"}';
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
        $this->getSaveAuthCompany();
        $company = \App\Company::where('id', $this->company == -1 ? $this->user->company_id : $this->company)->first();
        $this->modules = Module::select('id', 'send_mails', 'module_id', 'name', 'telit_ratePlan', 'telit_json', 'telit_status')
          ->when($this->company != -1, function($query) use ($company) {
            $query->where("company_id", $company->id);
          })->orderBy('module_id', 'DESC')->get();
        $this->users = User::when($this->company != -1, function($query) use ($company) {
            $query->where("company_id", $company->id);
          })->get();
        $notifs = NotificationController::getNotifs($request);
        /*$this->subscriptions = \App\Subscription::where('user_id', $user->id)->get();*/
        foreach ($notifs as $key => $notif) {
          $notif->created_at_date = $this->date_to_human($notif->created_at_date);
          $notif->resolved_at_date = $this->date_to_human($notif->resolved_at);
          if ($notif->type === "NO_LOG") {
            $notif->value = $this->date_to_human($notif->value, __("The") . " ");
          }
        }
        return view('auth/client', [
          "user" => $this->user,
          "company" => $company,
          "modules" => $this->modules,
          "users" => $this->users,
          "notifs" => $notifs,
          "official_locales" => json_decode($this::OFFICIAL_LOCALES),
          "locales" => json_decode($this::LOCALES),
          "phplocale" => $this->user->locale
        ]);
    }

    protected function date_to_human($date, $pre = "") {
      return $pre . date($this->user->locale === "en_US" ? "m/d/y " : "d/m/y ", strtotime($date)) . __("at") . date(" H:i:s", strtotime($date));
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

    public function changeLocale(Request $request) {
      request()->validate([
          'locale' => 'required',
      ]);

      $this->getSaveAuthCompany();
      $this->user->locale = substr(request()->locale, 0, 11);
      $this->user->save();
      $session = $request->getSession();
      $session->put('locale', $this->user->locale);
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
      return ;
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

    public function deleteUser(User $usertoDelete) {
        $user = Auth::user();
        if (($user->is_client_company && $user->company_id == $usertoDelete->company_id) || $user->su_admin) {
            $usertoDelete->delete();
        } else {
            return abort(401);
        }
        return response()->json(["ok"=>"ok"]);
    }
 
    public function modifUser($usertoModif) {
        $authUser = Auth::user();
        if ($authUser->company_id == 0) {
            return redirect()->route('consultation', []);
        }
        $usertoModif = User::find($usertoModif);
        if (($authUser->is_client_company
          && $authUser->company_id 
          == $usertoModif->company_id) || $authUser->su_admin) {
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
