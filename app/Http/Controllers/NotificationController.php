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
                 ->select("u.name AS name", "u.locale", "u.receive_mails", "u.id AS user_id", "u.email AS email", "c.id AS company_id", "c.name AS company", "m.name AS module_name", "m.telit_locAdress AS address", "n.id AS id_notif", "n.type", "n.value", "n.occurences", "n.resolved_at")
                 ->where('n.id', '=', $notif->id)
                 ->get();
    }

    public function renderMail(Notification $notif) {
        $this->getSaveAuthCompany();
        $infos = $this->getUsersInfoFromNotif($notif);
        if ($this->company == -1 && count($infos)) {
            return new ModuleAlert($infos[0]);
        }
        foreach ($infos as $key => $mail) {
            if ($this->user->id == $mail->user_id) {
                return new ModuleAlert($mail);
            }
        }
        return abort(403, __("You do not have the right to view this email.") . ($this->user->su_admin == 1 ? "\n" . __("No mail was sent because this company does not have a user.") : ""));
    }

    public function acknowledgeNotif(Notification $notif) {
        $notif->seen = true;
        $notif->save();
        return response()->json(['ok'=>'ok']);
    }

    public function postComment(Notification $notif) {
        $company = $this->getSaveAuthCompany();
        $infos = $this->getUsersInfoFromNotif($notif);
        $ok = false;
        if ($company == -1) {
            $ok = true;
        }

        foreach ($infos as $key => $mail) {
            if ($this->user->id == $mail->user_id) {
                $ok = true;
            }
        }
        if ($ok) {
            $notif->comment = request('comment');
            $notif->save();
            return response()->json(["comment" => $notif->comment]);
        }
        return response()->json([], 403);
    }

    private static function sendNotifMail(Notification $notif) {
        $usersinfo = NotificationController::getUsersInfoFromNotif($notif);
        $is_adminf = false;
        $is_adminff = false;
        if (config('app.debug') == true) {
            app()->setLocale("fr_FR");
            $info = $usersinfo[0];
            Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "theo.naciri@gmail.com" . " with value " . $notif->value);
            try {
                Mail::to("theo.naciri@gmail.com")->send(new ModuleAlert($info));
            } catch (Exception $e) {
                Log::info("MAIL: /!\ Catch email error: " . $e->getMessage());
            }
            return ;
        }
        foreach ($usersinfo as $key => $info) {
            app()->setLocale($info->locale);
            Log::info('MAIL: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . $info->email . " with value " . $notif->value);
            try {
                Mail::to($info)->send(new ModuleAlert($info));
            } catch (Exception $e) {
                Log::info("MAIL: /!\ Catch email error: " . $e->getMessage());
                if( count( Mail::failures() ) > 0 ) {
                    $failures[] = Mail::failures()[0];
                    dd($failures);
                }
            }   
            if ($info->email === "f.lefevre@pasdt.com") $is_adminf = true;
            if ($info->email === "fpelletier@logicom-informatique.com") $is_adminff = true;
        }
        if (count($usersinfo) && !$is_adminf) {
            app()->setLocale("fr-FR");
            $info = $usersinfo[0];
            Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "f.lefevre@pasdt.com" . " with value " . $notif->value);
            try {
                Mail::to("f.lefevre@pasdt.com")->send(new ModuleAlert($info));
            } catch (Exception $e) {
                Log::info("MAIL: /!\ Catch email error: " . $e->getMessage());
            }
        }
        if (count($usersinfo) && !$is_adminff) {
            app()->setLocale("fr-FR");
            $info = $usersinfo[0];
            Log::info('MAIL_ADMIN: ' . $info->module_name . ' Sending ' . $info->type . ' notif #' . $info->id_notif . " to " . "fpelletier@logicom-informatique.com" . " with value " . $notif->value);
            try {
                Mail::to("fpelletier@logicom-informatique.com")->send(new ModuleAlert($info));
            } catch (Exception $e) {
                Log::info("MAIL: /!\ Catch email error: " . $e->getMessage());
            }
        }
    }

    public static function newNotif($log, $type, $value) {
        $module_id = $log['cardId'] ?? "";
        if (!empty($module_id)) {
            $existing_not = Notification::where('module', '=', $module_id)
                                        ->where('resolved', '=', 0)
                                        ->where('type', '=', $type)
                                        ->orderByDesc('resolved_at')
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
        NotificationController::sendNotifMail($not);
        return $not;
    }

    public static function resolveOngoingNotifications($ongoingnotifs, $value, array $array_alerts_type) {
        foreach ($ongoingnotifs as $key => $alert) {
            if (in_array($alert->type, $array_alerts_type) && $alert->resolved == 0) {
                $alert->resolved = 1;
                $alert->resolved_at = DB::raw("NOW()");
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
        $id_company = NotificationController::getAuthCompany(false);
        if ($id_company === -1) {
            $id_company = "%%";
        }
        return Notification::select('notifications.id', 'comment', 'modules.name AS name', 'modules.module_id AS module_id', 'type', 'log', 'value', 'occurences', 'resolved', 'notifications.created_at', 'notifications.resolved_at')
            ->where('seen', $seen)
            ->leftJoin('modules', 'modules.module_id', '=', 'notifications.module')
            ->where('modules.company_id', "LIKE", $id_company)
            ->orderBy('notifications.resolved_at', 'DESC')
            ->limit($limit)->get();
    }

    public static function getNotifsCount(Request $request, int $seen = 0) {
        $id_company = NotificationController::getAuthCompany(false);
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
    /**
     * Get notif count
     *
     * @return int
     */

    public function APIgetNotifsCountAndLast(Request $request, $seen = '')
    {
        return response()->json(array(
            "count"=> $this->getNotifsCount($request, $seen === "seen"),
            "last" => $this->getNotifs($request, $seen === "seen", 1)
        ));
    }
}
