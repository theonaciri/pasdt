define([], function() {
	var getURLParameter = function(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.href);
	    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, '    '));
	};
	return getURLParameter;
});