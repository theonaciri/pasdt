<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\LogController;
use App\Http\Controllers\NotificationController;

class GetLastModulesTemp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pasdt:getLastModulesTemp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get last temperatures for each modules';

    protected $default_no_log_timer;
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->default_no_log_timer = config("pasdt.thresholds.NO_LOG.value");
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo("Starting schedule.\n");
        /* if no log received last 1h10 minutes and if there's no NO_LOG notification unseen */
        $notif_condition = NotificationController::getNoLogCondition();
        $modules = LogController::getLastModulesTempArray("", $notif_condition);
        foreach ($modules as $module) {
            $no_log_timer = $this->default_no_log_timer;
            if (!empty($module->thresholds)) {
                $mod_thresholds = json_decode($module->thresholds, true);
                if (is_array($mod_thresholds) && array_key_exists("NO_LOG", $mod_thresholds)) {
                    $no_log_timer = $mod_thresholds["NO_LOG"];
                }
                if (is_null($no_log_timer)) {
                    $msg = "No log from: " . $module->name . ":\t" . $module->temp_created_at . ". But user config prevents triggering an alarm.\n";
                    echo($msg);
                    Log::info($msg);
                    continue ;
                }
            }
            $b = date('Y-m-d H:i:s', strtotime('-' . $no_log_timer . ' minutes'));
            if ($module->temp_created_at < $b) {
                $msg = "No log from: " . $module->name . ":\t" . $module->temp_created_at . ".\n";
                echo($msg);
                Log::info($msg);
                NotificationController::newNotif(array("id" => "", "cardId" => $module->module_id), "NO_LOG", $module->temp_created_at, $no_log_timer);
            }
        }
    }
}
