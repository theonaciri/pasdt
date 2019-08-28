/*
* Log.js
*
* pasdt LOG
*/


module.exports = {
	datastore: "pasdt",
	attributes: {
		id: {
			type: "number",
			unique: true,
			example: 42,
			required: true
		},
		cardId: {
			type: "string",
			required: true,
			example: "FFFF65535"
		},
		msgId: {
			type: "string",
			example: "0006"
		},
		msg: {
			type: "string",
			required: true,
			example: `'["TRANSFORMATEUR", "12", "DECLENCHEMENT", "* DEFAUT GAZ"]'`
		},
		eventType: {
			type: "number",
			example: 2
		},
		options: {
			type: "string",
			required: true,
			example: `'{"tic": "1607", "transfo": {"num": 12, "uid": "FFFF65535", "firm": "V106", "type": "1"}}'`
		}
	}
}