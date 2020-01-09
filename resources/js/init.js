define(['js-cookie'], function(cookie) {
	var comp = $("#app").data("su_company");
	if (typeof comp != 'undefined') {
		console.log('::', comp);
		cookie.set('su_company', "2", {path: '/'})
	} else if (location.pathname === "/home") {
		cookie.remove('su_company');
	}
})