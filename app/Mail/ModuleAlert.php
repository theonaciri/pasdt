<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ModuleAlert extends Mailable
{
    use Queueable, SerializesModels;
    public $i;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($infos)
    {
        $this->i = $infos;
        $this->i->crit = strpos($this->i->type, "CRIT") !== false;
        $this->i->address = json_decode($this->i->address);
        //setlocale(LC_TIME, 'fr_FR.utf8','fra');
        //date_default_timezone_set('Europe/Paris');
        if ($this->i->type == "NO_LOG") {
            $this->i->diff = $this::time_ago($this->i->value, $this->i->resolved_at);
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "PASDT: ";
        $subject .= $this->i->type === "NO_LOG" ?
        "Votre module " . $this->i->module_name . " a arrêté d'émettre" :
        "Alerte " . (strpos($this->i->type, "BATTERY") !== false ? "batterie" : "température")
                  . " du module " . $this->i->module_name;
        return $this->markdown('emails.module-alert')
                    ->subject($subject);
    }

    private static function time_ago($lastlog, $now)
    {
        if (is_numeric($lastlog)) {
          $timestamp = $lastlog;
        } else {
          $timestamp = strtotime($lastlog);
        }
        $diff = time() - $timestamp;

        $min = 60;
        $hour = $min * $min;
        $day = $hour * 24;
        $month = $day * 30;

        if ($diff < 60) { // Under a min
            $round = $diff;
            $timeago = $round . " " . __("seconds");
        } else if ($diff < $hour * 2) { // Under two hours
            $round = round($diff / $min);
            $timeago = $round . " " . __("minutes");
        } else if ($diff < $day * 2) { // Under two days
            $round = round($diff / $hour);
            $timeago = $round . " " . __("hours");
        } else if ($diff < $month * 2) { // Under two months
            $round = round($diff / $day);
            $timeago = $round . " " . __("days");
        } else {
            $round = round($diff / $month);
            $timeago = $round ." " . __("months");
        }
        /*if ($round > 1 && strpos($timeago, "mois") === false) {
            $timeago .= "s";
        }*/
        return $timeago;
    }
}
