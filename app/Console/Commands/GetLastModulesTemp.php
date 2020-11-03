<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\LogController;
use App\Http\Controllers\NotificationController;

class getLastModulesTemp extends Command
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
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        /* if no log received last 1h10 minutes and if there's no NO_LOG notification unseen */
        $notif_condition = NotificationController::getNoLogCondition();
        $modules = LogController::getLastModulesTempArray("", $notif_condition);
        foreach ($modules as $module) {
            echo($module->name . ":\t\t" . $module->temp_created_at . "\n");
            NotificationController::newNotif(array("id" => "", "cardId" => $module->module_id), "NO_LOG", $module->temp_created_at);
        }
    }
}
