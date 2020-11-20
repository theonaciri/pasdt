define(['jquery'], function($) {
	var modules = JSON.parse($('#modulesData').html() || "{}");
	return {
		modules: modules
	}
});