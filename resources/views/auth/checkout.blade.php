@extends('layouts.app')

@section('content')

La facture sera envoyée sur votre mail : {{ Auth::user()->email }}
 <!-- Use the CSS tab above to style your Element's container. -->
<div id="card-element" class="MyCardElement">
  <!-- Elements will create input elements here -->
</div>
<div id="error"></div>
<!-- We'll put the error messages in this element -->
<div id="card-errors" role="alert"></div>

<button id="submit">Ajouter l'abonnement de 20 €</button>

<script>
	var usermail = "{{ Auth::user()->email }}";
	var stripe = Stripe("{{  env('STRIPE_KEY')}}");
</script>
@endsection