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
        setlocale(LC_TIME, 'fr_FR.utf8','fra');
        date_default_timezone_set('Europe/Paris');
        if ($this->i->type == "NO_LOG") {
            $this->i->diff = $this::time_ago($this->i->value, $this->i->updated_at);
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.module-alert');
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

        if ($diff < 60) { //Under a min
            $round = $diff;
            $timeago = $round . " seconde";
        } else if ($diff < $hour) { //Under an hour
            $round = round($diff / $min);
            $timeago = $round . " minute";
        } else if ($diff < $day) { //Under a day
            $round = round($diff / $hour);
            $timeago = $round . " heure";
        } else if ($diff < $month) { //Under a day
            $round = round($diff / $day);
            $timeago = $round . " jour";
        } else {
            $round = round($diff / $month);
            $timeago = $round ." mois";
        }
        if ($round > 1 && strpos($timeago, "mois") === false) {
            $timeago .= "s";
        }
        return $timeago;
    }
}
