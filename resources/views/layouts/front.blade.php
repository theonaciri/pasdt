<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="PASDT PWA">
    <link rel="apple-touch-icon" href="/images/logo-192.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <title>{{ config('app.name', 'PASDT') }}</title>

    <!-- Fonts -->
    <!-- <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet"> -->

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <style>
        html,
        body {
            background-color: #e0ebeb;
            color: #636b6f;
            font-family: sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }

        .content {
            text-align: center;
        }

        .title {
            font-size: 84px;
        }

        .links>a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }

        .m-t-md {
            margin-top: 30px;
        }
    </style>

</head>

<body class="page mode-home">
    <div class="flex-center position-ref full-height">

        <div class="content">

            <div class="logo-client">
            </div>

            <div class="title m-b-md">
                Suivi du parc transfos PASDT
            </div>

            <main class="py-4">
                @yield('content')
            </main>

            <div class="links m-t-md">
                <a href="https://pasdt.com">
                    <img src="images/logo-pasdt.png">
                </a>
            </div>

        </div>

    </div>
</body>

</html>