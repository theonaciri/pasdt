<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\User;
use App\Notification;
use App\Mail\ModuleAlert;

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
        //$log = json_decode($request->getContent());
        $n = $this->newNotif(array("id" => "", "cardId" => "1850-00060"), "NO_LOG", "2020-11-04 23:32:07");
        return response()->json(array("ok"=>"ok", "notif"=>$n));
    }

    private static function getUsersInfoFromNotif(Notification $notif) {
        return DB::table("notifications AS n")
                 ->join("modules AS m", "m.module_id", "=", "n.module")
                 ->join("companies AS c", "c.id", "=", "m.company_id")
                 ->join("users AS u", "u.company_id", "=", "c.id")
                 ->select("u.name AS name", "u.email AS email", "c.name AS company", "m.name AS module_name", "m.telit_locAdress AS address", "n.id AS id_notif", "n.type", "n.value", "n.occurences", "n.updated_at")
                 ->where('n.id', '=', $notif->id)
                 ->get();
    }

    public function renderMail(Notification $notif) {
        $infos = $this->getUsersInfoFromNotif($notif);
        return new ModuleAlert($infos[0]);
    }

    private static function sendNotifMail(Notification $notif) {
        $usersinfo = NotificationController::getUsersInfoFromNotif($notif);
        $is_admint = false;
        $is_adminf = false;
        // foreach ($usersinfo as $key => $info) {
        //     Log::info('MAIL: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . $info->email . " with value " . $notif->value);
        //     //Mail::to($info)->send(new ModuleAlert($info));
        //     if ($info->email === "f.lefevre@pasdt.com") $is_adminf = true;
        //     if ($info->email === "theo.naciri@gmail.com") $is_admint = true;
        // }
        //if (!$is_admint) Mail::to("f.lefevre@pasdt.com")->send(new ModuleAlert($usersinfo[0]));
        if (count($usersinfo) && !$is_admint) {
            $info = $usersinfo[0];
            Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . $info->email . " with value " . $notif->value);
            Mail::to("theo.naciri@gmail.com")->send(new ModuleAlert($info));
        }
        if (count($usersinfo) && !$is_adminf) {
            $info = $usersinfo[0];
            Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . $info->email . " with value " . $notif->value);
            //Mail::to("f.lefevre@pasdt.com")->send(new ModuleAlert($info));
        }
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
                NotificationController::sendNotifMail($existing_not);
                return $existing_not;
            }
        }
        $not = new Notification();
        $not->log = $log['id'] ?? "";
        $not->type = $type;
        $not->module = $module_id; 
        $not->value = $value;
        $not->save();
        NotificationController::sendNotifMail($not);
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
            ->orderBy('notifications.updated_at', 'DESC')
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
