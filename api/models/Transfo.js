/*
* Transfo.js
*
* Transfo
*/


module.exports = {
	attributes: {
		num: {
			type: "number",
			unique: true,
			example: 12,
			required: true
		},
		uid: {
			type: "string",
			required: true,
			example: "FFFF65535"
		},
		firm: {
			type: "string",
			example: "V106"
		},
		type: {
			type: "string",
			required: true,
			example: "1"
		}
	}
}