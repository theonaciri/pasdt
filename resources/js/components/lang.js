define([], function() {
	return function(text) {
		if (typeof locale === "undefined") {
			var locale = "en-us";
		}
		var locales = {
			"en-us": {
				"alarme": "alarm",
				"declenchement": "trigger",
				"defaut pression": "pressure fault",
				"defaut gaz": "gas fault",
				"Transformateur": "Transformer"
			},
			"fr-fr": {
				"Acquittal": "Acquittement",
				"Address": "Adresse",
				"All": "Tous",
				"Copy": "Copier",
				"During": "Pendant",
				"First occurence the : ": "Première occurence le : ",
				"Module ID": "ID du module",
				"No module name": "Pas de nom de module",
				"Not set": "Pas défini",
				"The": "Le",
				"to": "à",
				"Since": "Depuis",
				"Solved the : ": "Résolu le : ",
				"Still ongoing": "Toujours en cours",
				"Stop monitoring this module?": "Retirer la surveillance de ce module ?",
				/* alerts */
				/* admin */
				"Delete the account of ": "Supprimer le compte de ",
				"Delete the company ": "Supprimer le groupe ",
				"Details": "Détails",
				"Hide this notification for the customer too?": "Masquer cette notification pour le client aussi ?",
				"Key": "Clé",
				"Modify the module": "Modifier le module",
				"Please move": "Veuillez déplacer",
				" this module": " ce module",
				" these modules": " ces modules",
				" this user": " cet utilisateur",
				" these users": " ces utilisateurs",
				" to another group": " vers un autre groupe",
				"Unlink the module": "Dissocier le module",
				"Value": "Valeur"
			},
			"es-es": {
				"Absolución": "Acquittement",
				"Address": "Dirección",
				"All": "Todas",
				"Copy": "Copiar",
				"During": "Durante",
				"First occurence the : ": "Primera aparición del : ",
				"Module ID": "ID del módulo",
				"No module name": "Sin nombre de módulo",
				"Not set": "No establecido",
				"The": "Té",
				"to": "al",
				"Since": "Ya que",
				"Solved the : ": "Resuelto el : ",
				"Still ongoing": "Aún en curso",
				"Stop monitoring this module?": "¿Eliminar la supervisión de este módulo?",
				/* alerts */
				"alarme": "alarma",
				"declenchement": "gatillo",
				"defaut pression": "falla de presión",
				"defaut gaz": "falla de gas",
				"Transformateur": "Transformador",
				/* admin */
				"Delete the account of ": "¿Eliminar la cuenta de ",
				"Delete the company ": "¿Eliminar grupo ",
				"Details": "Detalles",
				"Hide this notification for the customer too?": "¿Ocultar esta notificación para el cliente también?",
				"Key": "Llave",
				"Modify the module": "Modificar el módulo",
				"Please move": "Por favor muévete",
				" this module": " este módulo",
				" these modules": " estos módulos",
				" this user": " este usuario",
				" these users": " estos usuarios",
				" to another group": " a otro grupo",
				"Unlink the module": "Desvincular el módulo",
				"Value": "Valor"
			},
			"it-it": {
				"Assoluzione": "Acquittement",
				"Address": "Indirizzo",
				"All": "Tutti",
				"Copy": "Copia",
				"During": "Durante",
				"First occurence the : ": "Prima occorrenza il : ",
				"Module ID": "ID modulo",
				"No module name": "Nessun nome del modulo",
				"Not set": "Non impostato",
				"The": "Il",
				"to": "a",
				"Since": "Per",
				"Still ongoing": "Ancora in corso",
				"Solved the : ": "Risolto il : ",
				"Stop monitoring this module?":"Rimuovere il monitoraggio da questo modulo?",
				/* alerts */
				"alarme": "Allarmami",
				"declenchement": "grilletto",
				"defaut pression": "difetto di pressione",
				"defaut gaz": "guasto del gas",
				"Transformateur": "Trasformatore",
				/* admin */
				"Delete the account of ": "Elimina il conto di ",
				"Delete the company ": "Rimuovere gruppo Ab ",
				"Details": "Dettagli",
				"Hide this notification for the customer too?": "Nascondere questa notifica anche per il cliente?",
				"Key": "Chiave",
				"Modify the module": "Modifica il modulo",
				"Please move": "Per favore muoviti",
				" this module": " questo modulo",
				" these modules": " questi moduli",
				" this user": " questo utente",
				" these users": " questi utenti",
				" to another group": " a otro grupo",
				"Unlink the module": "Scollega il modulo",
				"Value": "Valore"
			}
		}
		if (typeof locales[locale] === 'undefined' || typeof locales[locale][text] === "undefined") {
			return text;
		}
		return locales[locale][text];
	}
});