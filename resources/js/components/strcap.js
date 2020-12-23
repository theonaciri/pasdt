define([], function() {
	if (typeof String.prototype.capitalize != "function") {
		String.prototype.capitalize = function() {
		    return this.charAt(0).toUpperCase() + this.slice(1);
		}
	}
});