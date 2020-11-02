define(['jquery'], function($) {

	// get notifs
	function getNotif() {
		$.getJSON("/user/notifs")
		.done(function notifDone(n) {
			$('.notif-counter').html(n.length);
		})
		.fail(function notifFail(d) {

		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});