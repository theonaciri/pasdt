<?php
return [
	"API_TOKEN" => env("API_TOKEN"),
	"thresholds" => [
		"BATTERY_LOW" => 12.8,
		"BATTERY_CRIT_LOW" => 11.8,
		"BATTERY_HIGH" => 14.8,
		"BATTERY_CRIT_HIGH" => 15.8,
		"TEMP_LOW" => 20,
		"TEMP_CRIT_LOW" => 0,
		"TEMP_HIGH" => 80,
		"TEMP_CRIT_HIGH" => 90,
		"TEMP_DECREASE" => -20,
		"TEMP_INCREASE" => 20,
		"NO_BATTERY" => "",
		"NO_TEMP" => [785, -99],
		"NO_LOG" => 3900 /* 1h05 */
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