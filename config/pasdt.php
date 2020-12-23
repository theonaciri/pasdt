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
			"desc" => "Mininimum battery voltage before triggering a CRITICAL alert",
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
			"desc" => "Maximum battery voltage before triggering a CRITICAL alert",
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
			"desc" => "Minimum temperature before triggering a CRITICAL alert",
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
			"desc" => "Maximum temperature before triggering a CRITICAL alert",
			"min" => -98,
			"max" => 999
		],
		"TEMP_DECREASE" => [
			"value" => -20,
			"unit" => "°C",
			"desc" => "Maximum temperature decrease compared to previous data before triggering an alert",
			"min" => -90,
			"max" => -1
		],
		"TEMP_INCREASE" => [
			"value" => 20,
			"unit" => "°C",
			"desc" => "Maximum temperature increase compared to previous data before triggering an alert",
			"min" => 1,
			"max" => 99
		],
		"BATTERY_DECREASE" => [
			"value" => -1,
			"unit" => "V",
			"desc" => "Maximum battery decrease compared to previous data before triggering an alert",
			"min" => -90,
			"max" => -1
		],
		"BATTERY_INCREASE" => [
			"value" => 1,
			"unit" => "V",
			"desc" => "Maximum battery increase compared to previous data before triggering an alert",
			"min" => 1,
			"max" => 99
		],
		"NO_BATTERY" => [
			"value" => [-99],
			"unit" => "List",
			"desc" => "List of battery values considered incorrect (separate with a comma)",
			"min" => [],
			"max" => []
		],
		"NO_TEMP" => [
			"value" => [785, -99],
			"unit" => "List",
			"desc" => "List of temperature values considered incorrect (separate with a comma)",
			"min" => [],
			"max" => []
		],
		"NO_LOG" => [
			"value" => 80, /* 1h20 */
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