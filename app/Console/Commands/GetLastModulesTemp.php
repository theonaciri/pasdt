<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\LogController;
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
        $notif_condition = <<<EOTNOTIF
AND logs.created_at <= DATE_SUB(NOW(),INTERVAL 70 MINUTE) 
                AND module_id NOT IN (SELECT module FROM notifications WHERE type = 'NO_LOG' AND seen = 0)
EOTNOTIF;
        $modules = LogController::getLastModulesTempArray("", $notif_condition);
        foreach ($modules as $module) {
            echo($module->name . ":\t\t" . $module->temp_created_at . "\n");
            LogController::newNotif(array("id" => "", "cardid" => $module->module_id), "NO_LOG", $module->temp_created_at);
        }
    }
}
