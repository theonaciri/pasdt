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

    private static function getUserCompany($su_company = NULL, $store = false) {
        $user = Auth::user();
        if (empty($user)) return abort(403);
        $id_company = $user->company_id;
        if (!empty($user->su_admin) && $user->su_admin == 1) {
            if (!empty($su_company)) {
                $id_company = $su_company;
            } else {
                $id_company = -1;
            }
        }
        if ($store) {
            $this->user = $user;
        }
        return $id_company;
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
        $is_adminff = false;
        // foreach ($usersinfo as $key => $info) {
        //     Log::info('MAIL: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . $info->email . " with value " . $notif->value);
        //     //Mail::to($info)->send(new ModuleAlert($info));
        //     if ($info->email === "f.lefevre@pasdt.com") $is_adminf = true;
        //     if ($info->email === "theo.naciri@gmail.com") $is_admint = true;
        // }
        //if (!$is_admint) Mail::to("f.lefevre@pasdt.com")->send(new ModuleAlert($usersinfo[0]));
        // if (count($usersinfo) && !$is_admint) {
        //     $info = $usersinfo[0];
        //     Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "theo.naciri@gmail.com" . " with value " . $notif->value);
        //     Mail::to("theo.naciri@gmail.com")->send(new ModuleAlert($info));
        // }
        // if (count($usersinfo) && !$is_adminf) {
        //     $info = $usersinfo[0];
        //     Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "f.lefevre@pasdt.com" . " with value " . $notif->value);
        //     Mail::to("f.lefevre@pasdt.com")->send(new ModuleAlert($info));
        // }
        // if (count($usersinfo) && !$is_adminff) {
        //     $info = $usersinfo[0];
        //     Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "fpelletier@logicom-informatique.com" . " with value " . $notif->value);
        //     Mail::to("fpelletier@logicom-informatique.com")->send(new ModuleAlert($info));
        // }
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

    public static function resolveOngoingNotifications($ongoingnotifs, $value, array $array_alerts_type) {
        foreach ($ongoingnotifs as $key => $alert) {
            if (in_array($alert->type, $array_alerts_type) && $alert->resolved == 0) {
                $alert->resolved = 1;
                $alert->seen = 0;
                $alert->value = $value;
                $alert->save();
            }
        }
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

    public static function getNotifs(Request $request, int $seen = 0, int $limit = 20) {
        $id_company = NotificationController::getUserCompany($request->company ?? NULL, false);
        if (!$id_company) return NULL;
        if ($id_company === -1) {
            $id_company = "%%";
        }
        return Notification::select('notifications.id', 'modules.name AS name', 'type', 'log', 'value', 'occurences', 'resolved', 'notifications.created_at', 'notifications.updated_at')
            ->where('seen', $seen)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', "LIKE", $id_company)
            ->orderBy('notifications.updated_at', 'DESC')
            ->limit($limit)->get();
    }

    public static function getNotifsCount(Request $request, int $seen = 0) {
        $id_company = NotificationController::getUserCompany($request->company ?? NULL, false);
        if (!$id_company) return NULL;
        if ($id_company === -1) {
            $id_company = "%%";
        }
        return Notification::where('seen', $seen)->where('resolved', 0)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', "LIKE", $id_company)->count();
    }

    /**
     * Get notif content
     *
     * @return JSON
     */
    public function APIgetNotifs(Request $request, $seen = '')
    {
        return response()->json($this->getNotifs($request, $seen === "seen", 100));
    }

    /**
     * Get notif count
     *
     * @return int
     */

    public function APIgetNotifsCount(Request $request, $seen = '')
    {
        return response()->json($this->getNotifsCount($request, $seen === "seen"));
    }
}
