<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;

class Locale {

  const SESSION_KEY = 'locale';
  const LOCALES = ['fr', 'en', 'cs'];

  public function handle(Request $request, Closure $next) {
    /** @var Session $session */
    $session = $request->getSession();

    if (!$session->has(self::SESSION_KEY)) {
      $session->put(self::SESSION_KEY, $request->getPreferredLanguage(self::LOCALES));
    }

    if ($request->has('lang')) {
      $lang = $request->get('lang');
      if (in_array($lang, self::LOCALES)) {
        $session->put(self::SESSION_KEY, $lang);
      }
    }

    app()->setLocale($session->get(self::SESSION_KEY));

    return $next($request);
  }
}