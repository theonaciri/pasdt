<!doctype html>
<html lang="{{ $locale }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="@lang('Log monitoring') PASDT" />
    <meta name="theme-color" content="#2F3BA2">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-title" content="PASDT PWA" />
    <title>{{ config('app.name', 'PASDT') }}</title>
    <link rel="apple-touch-icon" href="/images/logo-192.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/images/logo-192.png" />

    @if (Route::currentRouteName() == 'consultation')
    <link rel="stylesheet" href="/css/anychart-ui.min.css" />
    @endif

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet" />
    
    <style>
    @if(!empty($_company->colors))
        body {
            background-color: {{ $_company->colors }} 
        }
    @endif
    </style>
</head>
<body {{!empty($user) && $user->su_admin == 1 ? 'data-admin=true' : ''}}>
    @if ($su_applied) 
    <div id="app" data-su_company="{{$_company->id}}">
        <nav class="navbar navbar-expand-md navbar-light bg-warning shadow-sm">
            <div class="container">
                <a class="btn btn-primary" data-toggle="tooltip" data-placement="bottom" href="{{ url('su_admin')}}" title='{{ ("You are taking control of another company. Click here to return to yours") }}' alt='@lang("You are taking control of another company. Click here to return to yours")'>
                    <span class="oi oi-warning"></span>&nbsp;
                    <span class="oi oi-account-logout"></span>&nbsp;
                </a>&nbsp;
                <a class="navbar-brand" href="{{ url('/consultation?company=' . $_company->id) }}" title='{{ ("You are taking control of another company. Click here to return to yours") }}' alt='@lang("You are taking control of another company. Click here to return to yours")'>
    @else
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/consultation') }}" title='{{ __("Back to Home") }}'>
    @endif
                    @if (!empty($_company))
                        @if (!empty($_company->logo))
                            <img src="images/companylogos/{{ $_company->logo }}" height="39" alt='{{ __("Back to Home") }}' />
                        @endif
                        
                        @if ($_company->name )
                            {{ $_company->name }}
                        @else
                            {{ config('app.name', 'PASDT') }}
                        @endif
                    @endif
                </a>
                <span id="disconnected-header" class="d-none" data-toggle="tooltip" data-placement="bottom" title='@lang("The latest data received is displayed. Click this link to refresh the data.")'>
                    <span class="oi oi-warning"></span>
                    <small>&nbsp;
                        <span class="hide-xxs">@lang("You are disconnected")</span>
                        <span class="show-xxs">@lang("Disconnected")</span>
                    </small>
                    &nbsp;
                    <a href="/login" class="btn btn-primary" id="reconnect-button">@lang("Reconnect")</a>
                </span>
                <span id="backonline-header" class="d-none"><span class="oi oi-check"></span><small>&nbsp;@lang("Connection restored")</small></span>
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
                                <a class="nav-link" href="{{ route('login') }}">@lang('Login')</a>
                            </li>
                        @else
                            @if (Route::has('register') && Auth::user()->su_admin)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('register') }}">@lang("New access")</a>
                                </li>
                            @endif
                            @if (Route::has('client') && Auth::user()->company_id != 0)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{$su_applied ? route('client', ['company' => $_company->id]) : route('client')}}">@lang("Manage my fleet")
                                        <span class="badge badge-pill badge-danger notif-counter" data-toggle="tooltip" data-placement="bottom" title='@lang("New notifications")' data-trigger="manual"></span>
                                        <span class="sr-only">@lang("Unread notifications")</span>
                                    </a>
                                </li>
                            @endif
                            @if (Route::has('checkout') && Auth::user()->is_client_company === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('checkout') }}">@lang("Subscription")</a>
                                </li>
                            @endif
                            @if (Route::has('su_admin') && Auth::user()->su_admin === 1)
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('su_admin') }}">@lang("Administrator configuration")</a>
                                </li>
                            @endif
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a id="logoff-button" class="dropdown-item" href="{{ route('logout') }}">
                                        @lang("Disconnect")
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
    @if ($locale && $locale !== "en-us" && $locale !== "fr-fr")
    <script src="{{ '/json/locales/anychart/' . $locale . '.js'}}"></script>
    <script src="{{ '/json/locales/moment/' . $locale . '.js'}}"></script>
    @endif
    <script>
        var locale = "{{ $locale ?? 'en-us'}}";
    </script>
    <!-- Scripts -->
    <!-- <script src="/js/require.js"></script>-->
    @if (Route::currentRouteName() == 'checkout')
        <script src="https://js.stripe.com/v3/"></script>
        <!--  <link rel="stylesheet" href="StripeElements.css"> -->
        <!--<script src="{{ asset('js/checkout.js') }}" defer></script>-->
    @elseif (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false))
        {{-- is IE 11 or below --}}
        <script src="{{ asset('js/app.es5.js') }}"></script>
        <script src="/js/anychart-bundle.js"></script>
    @else
        <script src="{{ asset('js/app.js') }}"></script>
        @if (Route::currentRouteName() == 'consultation' || Route::currentRouteName() == 'welcome')
            <script src="/js/anychart-bundle.js" defer></script>
        @endif
    @endif
    <script>
        // Register service worker
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((reg) => {
                  /*console.log('Service worker registered.', reg);*/
                });
          });
        }
    </script>
</body>

</html>
