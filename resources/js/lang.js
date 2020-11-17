define([], function() {
	return function(text, lang) {
		if (typeof lang === "undefined") {
			lang = locale;
		}
		if (typeof lang === "undefined" || lang === "en-us") {
			return text;
		}
		var locales = {
			"fr-fr": {
				"The": "Le",
				"to": "à",
				"Copy": "Copier",
				"All": "Tous"
			},
			"es-es": {
				"The": "Té",
				"to": "al",
				"Copy": "Copiar",
				"All": "Todas"
			},
			"it-it": {
				"The": "Il",
				"to": "a",
				"Copy": "Copia",
				"All": "Tutti"
			}
		};
		if (typeof locales[lang] === 'undefined' || typeof locales[lang][text] === "undefined") {
			return text;
		}
		return locales[lang][text];
	}
});