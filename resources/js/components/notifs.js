define(['jquery'], function($) {

	// get notifs
	function getNotif() {
		$.getJSON("/notifs/count")
		.done(function notifDone(n) {
			$('.notif-counter').html(n);
		})
		.fail(function notifFail(d) {

		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});