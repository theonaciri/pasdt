define(['jquery', './getURLParameter'], function($, getURLParameter) {
	function getNotif() {
		var admincomp = getURLParameter("company");
		$.get("/notifs/count" + (admincomp ? "?company=" + admincomp : ""))
		.done(function(n) {
			$('.notif-counter').html(n != '0' ? n : '');
		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});