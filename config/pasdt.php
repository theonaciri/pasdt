<?php
return [
	"API_TOKEN" => env("API_TOKEN"),
	"thresholds" => [
		"BATTERY_LOW" => [
			"value" => 11.8,
			"unit" => "V",
			"desc" => "Mininimum battery voltage before triggering an alert",
			"min" => 3,
			"max" => 20
		],
		"BATTERY_CRIT_LOW" => [
			"value" => 10.8,
			"unit" => "V",
			"desc" => "Mininimum battery voltage before CRITICAL triggering an alert",
			"min" => 3,
			"max" => 20
		],
		"BATTERY_HIGH" => [
			"value" => 14.8,
			"unit" => "V",
			"desc" => "Maximum battery voltage before triggering an alert",
			"min" => 3,
			"max" => 20
		],
		"BATTERY_CRIT_HIGH" => [
			"value" => 15.2,
			"unit" => "V",
			"desc" => "Maximum battery voltage before CRITICAL triggering an alert",
			"min" => 3,
			"max" => 20
		],
		"TEMP_LOW" => [
			"value" => 5,
			"unit" => "°C",
			"desc" => "Minimum temperature before triggering an alert",
			"min" => -98,
			"max" => 999
		],
		"TEMP_CRIT_LOW" => [
			"value" => -5,
			"unit" => "°C",
			"desc" => "Minimum temperature before CRITICAL triggering an alert",
			"min" => -98,
			"max" => 999
		],
		"TEMP_HIGH" => [
			"value" => 80,
			"unit" => "°C",
			"desc" => "Maximum temperature before triggering an alert",
			"min" => -98,
			"max" => 999
		],
		"TEMP_CRIT_HIGH" => [
			"value" => 90,
			"unit" => "°C",
			"desc" => "Maximum temperature before CRITICAL triggering an alert",
			"min" => -98,
			"max" => 999
		],
		"TEMP_DECREASE" => [
			"value" => -20,
			"unit" => "°C",
			"desc" => "Maximum temperature decrease before triggering an alert",
			"min" => -90,
			"max" => -1
		],
		"TEMP_INCREASE" => [
			"value" => 20,
			"unit" => "°C",
			"desc" => "Maximum temperature increase before triggering an alert",
			"min" => 1,
			"max" => 99
		],
		"NO_BATTERY" => [
			"value" => [-99],
			"unit" => "List",
			"desc" => "List of incorrect battery values (separate with a comma)",
			"min" => [],
			"max" => []
		],
		"NO_TEMP" => [
			"value" => [785, -99],
			"unit" => "List",
			"desc" => "List of incorrect temperature values (separate with a comma)",
			"min" => [],
			"max" => []
		],
		"NO_LOG" => [
			"value" => 70, /* 1h05 */
			"unit" => "minutes",
			"desc" => "Minutes without receiving data before triggering an alert",
			"min" => 2,
			"max" => 43200 /* 1 month */ 
		]
		/*"TOO_MANY_LOGS" => 60,*/
	],
	"telit" => [
		"USERNAME" => env("TELIT_USERNAME"),
		"PASSWORD" => env("TELIT_PASSWORD"),
		"SESSION_ID_PATH" => env("TELIT_SESSION_ID_PATH"),
		"VAPID_PUBLIC_KEY" => env("VAPID_PUBLIC_KEY"),
		"VAPID_PRIVATE_KEY" => env("VAPID_PRIVATE_KEY"),
	],
	"cashier" => [
		"CURRENCY" => "eur",
		"LOGGER" => "default",
		"CURRENCY_LOCALE" => "fr_FR",
		"LOGGER" => "default",
		"STRIPE_KEY" => env("STRIPE_KEY"),
		"STRIPE_SECRET" => env("STRIPE_SECRET"),
	]

];