@component('mail::message')
<h1 style="text-align: center;">Nouvelle alerte{{ $i->crit ? " critique" : ""}} pour votre module<br>{{ $i->module_name }}</h1>
<br>

Le {{strftime("%A %e %B %Y à %Hh%M", strtotime($i->updated_at))}}
@if ($i->type === "NO_LOG")
le portail a détécté qu'il n'a plus reçu de données de votre module depuis __{{ $i->diff }}__, le __{{strftime("%A %e %B %Y à %Hh%M", strtotime($i->value))}}__.


@else
votre module a déclenché l'alerte {{ $i->crit ? " __CRITIQUE__" : ""}} suivante : __{{$i->type}}__
avec la valeur de
__{{$i->value}}__
@if (strpos($i->type, "TEMP") !== false)
__°C__.
@elseif (strpos($i->type, "BAT") !== false)
__V__.
@endif
@endif

Une action {{ $i->crit ? "urgente " : "" }} de votre part est sûrement nécessaire.

@if (is_object($i->address))
Localisation du module :

{{ $i->address->street ?? "" }}
{{ $i->address->streetNumber ?? "" }}
{{ $i->address->zipCode ?? "" }}
{{ $i->address->city ?? "" }}
{{ $i->address->state ?? "" }}
{{ $i->address->country ?? "" }}
@endif

@component('mail::button', ['url' => config('app.url') . '/client'])
Consulter sur PASDT
@endcomponent

Bien cordialement,

{{ config('app.name') }}
@endcomponent