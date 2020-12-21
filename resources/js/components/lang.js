define(["../lang/fr-fr.js"], function() {
	// default language is french
	// other languages are included in app.blade.php
	if (typeof locale === "undefined") {
		locale = document.documentElement.getAttribute('lang');
		if (typeof locale === "undefined" || !locale.length) {
			locale = "fr-fr";
		}
	}
	return function(text) {
		if (typeof locales === 'undefined' || typeof locales[text] === "undefined") {
			return text;
		}
		return locales[text];
	}
});