<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="suivi de logs PASDT">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="PASDT PWA">
    <link rel="apple-touch-icon" href="/images/logo-192.png">
    <link rel="manifest" href="/manifest.webmanifest">

    <title>{{ config('app.name', 'PASDT') }}</title>
    <link rel="apple-touch-icon" href="/images/logo-192.png">
    <!-- Fonts -->
    <!-- <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet"> -->
    <link rel="stylesheet" href="/css/anychart-ui.min.css" defer/>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <!--<link href="{{ asset('css/app2.css') }}" rel="stylesheet">-->
    
    <style>
        @if(!empty($_company->colors))
        body {
            background-color: {{ $_company->colors }} 
        }
    @endif
    </style>
</head>
<body>
    @if ($su_applied) 
    <div id="app" data-su_company="{{$_company->id}}">
        <nav class="navbar navbar-expand-md navbar-light bg-warning shadow-sm">
            <div class="container">
                    <a href="{{ url('consultation')}}" title="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revenir à la vôtre"  alt="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revennir à la vôtre"><span class="oi oi-warning"></span></a>
                <a class="navbar-brand" href="{{ url('/consultation') }}" title="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revenir à la vôtre"  alt="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revenir à la vôtre">
    @else
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/consultation') }}" title="Retour à l'accueil">
    @endif
                    @if (!empty($_company))
                        @if (!empty($_company->logo))
                            <img src="images/companylogos/{{ $_company->logo }}" height="39" alt="Retour à l'accueil"/>
                        @endif
                        
                        @if ($_company->name )
                            {{ $_company->name }}
                        @else
                            {{ config('app.name', 'PASDT') }}
                        @endif
                    @endif
                </a>
                <span id="disconnected-header" class="d-none" data-toggle="tooltip" data-placement="bottom" title="Les dernières données reçues sont affichées, actualisez la page pour rafraîchir les données."><span class="oi oi-warning"></span><small>&nbsp;<span class="hide-xxs">Vous êtes </span>déconnecté</small></span>
                <span id="backonline-header" class="d-none"><span class="oi oi-check"></span><small>&nbsp;Connexion rétablie</small></span>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('login') }}">{{ __('Connexion') }}</a>
                            </li>
                        @else
                            @if (Route::has('register') && Auth::user()->su_admin)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('register') }}">{{ __("Nouvel accès") }}</a>
                                </li>
                            @endif
                            @if (Route::has('client') && Auth::user()->company_id != 0)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{$su_applied ? route('client', ['company' => $_company->id]) : route('client')}}">{{ __("Gérer mon parc") }}
                                    <span class="badge badge-pill badge-danger notif-counter"></span>
                                    <span class="sr-only">Notifications non lues</span></a>
                                </li>
                            @endif
                            @if (Route::has('checkout') && Auth::user()->is_client_company === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('checkout') }}">{{ __("Abonnement") }}</a>
                                </li>
                            @endif
                            @if (Route::has('su_admin') && Auth::user()->su_admin === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('su_admin') }}">{{ __("Configuration administrateur") }}</a>
                                </li>
                            @endif
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a id="logoff-button" class="dropdown-item" href="{{ route('logout') }}">
                                        {{ __('Se déconnecter') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>
        <main class="py-4">
            @yield('content')
        </main>
    </div>
    <!-- Scripts -->
    <!-- <script src="/js/require.js"></script>-->

    @if (Route::currentRouteName() == 'checkout')
        <script src="https://js.stripe.com/v3/"></script>
        <!--  <link rel="stylesheet" href="StripeElements.css"> -->
        <!--<script src="{{ asset('js/checkout.js') }}" defer></script>-->
    @elseif (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false))
        {{-- is IE 11 or below --}}
        <script src="{{ asset('js/app.es5.js') }}" defer></script>
    @else
        <script src="{{ asset('js/app.js') }}" defer></script>
        <script src="/js/anychart-bundle.js" type="text/javascript" defer></script>
    @endif
    <script>
        // Register service worker
        // if ('serviceWorker' in navigator) {
        //   window.addEventListener('load', () => {
        //     navigator.serviceWorker.register('/service-worker.js')
        //         .then((reg) => {
        //           /*console.log('Service worker registered.', reg);*/
        //         });
        //   });
        // }
    </script>
</body>

</html>
