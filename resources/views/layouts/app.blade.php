<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'PASDT') }}</title>

    <!-- Scripts -->
    <script src="/js/manifest.js"></script>
    <script src="/js/require.js"></script>
    @if (Route::currentRouteName() == 'checkout')
        <script src="https://js.stripe.com/v3/"></script>
        <!--  <link rel="stylesheet" href="StripeElements.css"> -->
        <script src="{{ asset('js/checkout.js') }}" defer></script>
    @elseif (FALSE && preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false))
        {{-- is IE 11 or below --}}
        <script src="/js/vendor.es5.js"></script>
        <script src="{{ asset('js/app.es5.js') }}" defer></script>
    @else
        <script src="/js/vendor.js"></script>
        <script src="{{ asset('js/app.js') }}" defer></script>
    @endif

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/datatables-bootstrap4.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <style>
        @if(isset($_company->colors))
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
                    <a href="{{ url('home')}}" title="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revennir à la vôtre"  alt="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revennir à la vôtre"><span class="oi oi-warning"></span></a>
                <a class="navbar-brand" href="{{ url('/home') }}" title="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revenir à la vôtre"  alt="Vous prenez le contrôle d'une autre entreprise. Cliquez ici pour revenir à la vôtre">
    @else
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/home') }}" title="Retour à l'accueil">
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
                                    <a class="nav-link" href="{{ route('client') }}">{{ __("Panneau de configuration") }}</a>
                                </li>
                            @endif
                            @if (Route::has('checkout') && Auth::user()->is_client_company === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('checkout') }}">{{ __("Abonnement") }}</a>
                                </li>
                            @endif
                            @if (Route::has('su_admin') && Auth::user()->su_admin === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('su_admin') }}">{{ __("Entreprises") }}</a>
                                </li>
                            @endif
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
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
</body>
</html>
