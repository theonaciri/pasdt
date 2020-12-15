@component('mail::message')
<h1 style="text-align: center;">@lang($i->crit ? "New critical alert" : "New alert") @lang("for your module")<br>{{ $i->module_name }}</h1>
<br>

@lang("The") {{ $i->resolved_date . " " . __("at") . " " . $i->resolved_time }}
@if ($i->type === "NO_LOG")
@lang("the portal has detected that it has not received any data from your module since") __{{ $i->diff }}__, @lang("the") __{{ $i->value_date . " " . __("at") . " " . $i->value_time }}__.

@else
@lang($i->crit ? "your module triggered the following __CRITICAL__ alert:" : "your module triggered the following alert:") __{{ __($i->type) }}__
@lang("with the value of") 
__{{$i->value}}__
@if (strpos($i->type, "TEMP") !== false)
__°C__.
@elseif (strpos($i->type, "BAT") !== false)
__V__.
@endif
@endif

@lang($i->crit ? "You may need to intervene urgently" : "You may need to intervene").

@if (!empty($i->address))
<span style="text-decoration: underline;">@lang("Module location"):</span>

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