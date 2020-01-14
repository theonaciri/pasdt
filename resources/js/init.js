define(['js-cookie'], function(cookie) {

	window.getUrlParameter = function(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.href);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, '    '));
	};
	var comp = $("#app").data("su_company");
	if (typeof comp != 'undefined') {
		console.log('::', comp);
		cookie.set('su_company', "2", {path: '/'})
	} else if (location.pathname === "/home") {
		cookie.remove('su_company');
	}
})