@extends('errors::minimal')

@section('title', __('Page Expired'))
@section('code', '419')
@section('message', __("L'application vient de se mettre à jour, veuillez relancer logs.pasdt.com"))
@section('message', __("Si l'action se reproduit, cliquez ici: "))
<button id="no-service-worker"
        onClick="localStorage.setItem('allow-service-worker', 'NO'); location.href = '/'">
    @lang("Relancer sans cache")
</button>