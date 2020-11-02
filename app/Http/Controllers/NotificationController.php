<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Notification;

class NotificationController extends Controller
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
     * Get notifs
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    public static function getNotifs($id_company, int $seen = 0, int $limit = 20) {
        if (!$id_company) return NULL;
        return Notification::select('notifications.id', 'modules.name AS name', 'type', 'log', 'value', 'notifications.created_at', 'notifications.updated_at')
            ->where('seen', $seen)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', $id_company)
            ->orderBy('id', 'DESC')
            ->limit($limit)->get();
    }

    public static function getNotifsCount($id_company, int $seen = 0) {
        if (!$id_company) return NULL;
        return Notification::where('seen', $seen)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', $id_company)->count();
    }

    /**
     * Show the application Su dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function APIgetNotifs(Request $request, $seen = '')
    {
        $user = Auth::user();
        if (empty($user)) return abort(403);
        $su_company = $request->company ?? NULL;
        $id_company = $user->company_id;
        if (!empty($user->su_admin) && $user->su_admin == 1 && !empty($su_company)) {
          $id_company = $su_company;
        }
        return response()->json($this->getNotifs($id_company, $seen === "seen", 100));
    }
    public function APIgetNotifsCount(Request $request, $seen = '')
    {
        $user = Auth::user();
        if (empty($user)) return abort(403);
        $su_company = $request->company ?? NULL;
        $id_company = $user->company_id;
        if (!empty($user->su_admin) && $user->su_admin == 1 && !empty($su_company)) {
          $id_company = $su_company;
        }
        return response()->json($this->getNotifsCount($id_company, $seen === "seen"));
    }
}
