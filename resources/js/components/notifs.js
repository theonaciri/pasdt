define(['jquery', './getURLParameter'], function($, getURLParameter) {
	function getNotif() {
		var admincomp = getURLParameter("company");
		$.getJSON("/notifs/count" + (admincomp ? "?company=" + admincomp : ""))
		.done(function notifDone(n) {
			$('.notif-counter').html(n);
		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});