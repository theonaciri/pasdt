@component('mail::message')
<h1 style="text-align: center;">@lang($i->crit ? "New critical alert" : "New alert") @lang("for your module")<br>{{ $i->module_name }}</h1>
<br>

@lang("The") {{strftime("%A %e %B %Y " . __("at") . " %H" . __(":") . "%M", strtotime($i->resolved_at))}}
@if ($i->type === "NO_LOG")
@lang("the portal has detected that it has not received any data from your module since") __{{ $i->diff }}__, @lang("the") __{{strftime("%A %e %B %Y " . __("at") . " %Hh%M", strtotime($i->value))}}__.

@else
@lang($i->crit ? "your module triggered the following __CRITICAL__ alert:" : "your module triggered the following alert:") __{{$i->type}}__
@lang("with the value of") 
__{{$i->value}}__
@if (strpos($i->type, "TEMP") !== false)
__°C__.
@elseif (strpos($i->type, "BAT") !== false)
__V__.
@endif
@endif

@lang($i->crit ? "You may need to intervene urgently" : "You may need to intervene").

@if (is_object($i->address))
@lang("_Module location_")

{{ $i->address->street ?? "" }}
{{ $i->address->streetNumber ?? "" }}
{{ $i->address->zipCode ?? "" }}
{{ $i->address->city ?? "" }}
{{ $i->address->state ?? "" }}
{{ $i->address->country ?? "" }}
@endif

@component('mail::button', ['url' => config('app.url') . '/client'])
@lang("Consult on") PASDT
@endcomponent

@lang("Best regards"),

{{ config('app.name') }}
@endcomponent