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

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->no_log_timer = config("pasdt.thresholds.NO_LOG.value");
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
            if (!empty($module->thresholds)) {
                $thresholds = json_decode($module->thresholds);
                if (is_array($thresholds) && is_int($thresholds['NO_LOG'])) {
                    $this->no_log_timer = $thresholds['NO_LOG'];
                }
            }
            $b = date('Y-m-d H:i:s', strtotime('-' . $this->no_log_timer . ' minutes'));
            if ($module->temp_created_at < $b) {
                echo("No log from: " . $module->name . ":\t\t" . $module->temp_created_at . "\n");
                Log::info("No log from: " . $module->name . ":\t\t" . $module->temp_created_at . "\n");
                NotificationController::newNotif(array("id" => "", "cardId" => $module->module_id), "NO_LOG", $module->temp_created_at);
            }
        }
    }
}
