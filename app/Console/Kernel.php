<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Schema;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;
use App\Module;
use App\Http\Controllers\LogController;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
        /*$schedule->exec('/home/cfmhtacoep-theon/www/pasdt/app/Console/update_db.sh')
        ->twiceDaily(8, 14)->environments(['production']);*/
        
        /* UPDATE TELIT */
        $schedule->call('App\Http\Controllers\ModuleController@updateModules')->dailyAt('9:00');

        /* UPDATE NO LOG RECEIVED */
        $notif_condition = <<<EOTNOTIF
AND logs.created_at <= DATE_SUB(NOW(),INTERVAL 70 MINUTE) 
                AND module_id NOT IN (SELECT module FROM notifications WHERE type = 'NO_LOG' AND seen = 0)
EOTNOTIF;
        Log::info("Starting schedule.");
        $modules = LogController::getLastModulesTempArray("", $notif_condition);
        foreach ($modules as $module) {
            $schedule->call(function() use ($module) {
                Log::info("No log from: " . $module->name . ":\t\t" . $module->temp_created_at . "\n");
                LogController::newNotif(array("id" => "", "cardId" => $module->module_id), "NO_LOG", $module->temp_created_at);
            })->everyMinute(); //hourly
        }
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
