define([], function() {
	return function(text, lang) {
		if (typeof lang === "undefined") {
			lang = locale;
		}
		if (typeof lang === "undefined" || lang === "en") {
			return text;
		}
		var locales = {
			"fr": {
				"The": "Le",
				"to": "à"
			},
			"es": {
				"The": "Té",
				"to": "al"
			},
			"it": {
				"The": "Il",
				"to": "a"
			}
		};
		if (typeof locales[lang] === 'undefined' && typeof locales[lang][text] === "undefined") {
			return text;
		}
		return locales[lang][text];
	}
});