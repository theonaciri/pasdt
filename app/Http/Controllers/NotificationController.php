<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        //$this->middleware('auth');
    }

    public function noData(Request $request) {
        Log::info('no');
        $n = $this->newNotif(array("id" => "", "cardId" => "1850-00029"), "NO_LOG", DB::raw("TIMESTAMPDIFF(SECOND,'2009-05-18','2009-07-29')"));
        return response()->json(array("ok"=>"ok", "notif"=>$n));
    }

    public static function newNotif($log, $type, $value) {
        $module_id = $log['cardId'] ?? "";
        if (!empty($module_id)) {
            $existing_not = Notification::where('module', '=', $module_id)
                                        ->where('resolved', '=', 0)
                                        ->where('type', '=', $type)
                                        ->orderByDesc('updated_at')
                                        ->first();
            if (!empty($existing_not)) {
                $existing_not->log = $log['id'] ?? "";
                $existing_not->occurences += 1;
                $existing_not->value = $value;
                $existing_not->seen = 0;
                $existing_not->save();
                return $existing_not;
            }
        }
        $not = new Notification();
        $not->log = $log['id'] ?? "";
        $not->type = $type;
        $not->module = $module_id; 
        $not->value = $value;
        $not->save();
        return $not;
    }

    public static function yesLog($log) {
        $module_id = $log['cardId'];
        if (empty($module_id)) return NULL;
        $nolognot = Notification::where('module', '=', $module_id)
                                ->where('resolved', '=', 0)
                                ->where('type', '=', 'NO_LOG')
                                ->orderByDesc('updated_at')
                                ->first();
        if (!empty($nolognot)) {
            $nolognot->log = $log['id'] ?? "";
            $nolognot->resolved = 1;
            $nolognot->seen = 0;
            $nolognot->value = DB::raw("NOW()");
            $nolognot->save();
            return $nolognot;
        }
        return $nolognot;
    }

    public static function getNoLogCondition() {
        return <<<EOTNOTIF
                AND logs.created_at <= DATE_SUB(NOW(),INTERVAL 70 MINUTE) 
                AND module_id NOT IN (SELECT module FROM notifications WHERE type = 'NO_LOG' AND resolved = 0)
EOTNOTIF;
    }

    /**
     * Get notifs
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    public static function getNotifs($id_company, int $seen = 0, int $limit = 20) {
        if (!$id_company) return NULL;
        return Notification::select('notifications.id', 'modules.name AS name', 'type', 'log', 'value', 'occurences', 'resolved', 'notifications.created_at', 'notifications.updated_at')
            ->where('seen', $seen)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', $id_company)
            ->orderBy('id', 'DESC')
            ->limit($limit)->get();
    }

    public static function getNotifsCount($id_company, int $seen = 0) {
        if (!$id_company) return NULL;
        return Notification::where('seen', $seen)->where('resolved', 0)
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
