define([], function() {
	if (typeof locale === "undefined") {
		var locale = document.documentElement.getAttribute('lang');
		if (typeof locale === "undefined" || !locale.length) {
			var locale = "fr-fr";
		}
	}
	return function(text) {
		if (typeof locales[locale] === 'undefined' || typeof locales[locale][text] === "undefined") {
			return text;
		}
		return locales[locale][text];
	}
});