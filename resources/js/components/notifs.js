define(['jquery', './getURLParameter'], function($, getURLParameter) {
	var firstcall = true;

	function getNotificationPermission() {
	    if ("Notification" in window && Notification.permission === 'granted') {
	        return localStorage.getItem('notification-permission');
	    } else {
	        return Notification.permission;
	    }
	}
	function getNotif() {
		var admincomp = getURLParameter("company");
		$.getJSON("/notifs/count_last" + (admincomp ? "?company=" + admincomp : ""))
		.done(function(data) {
			n = +data.count;
			$notifcounter = $('.notif-counter');
			previouscounter = +$notifcounter.html();
			$notifcounter.html(n != 0 ? n : '');
			if (!firstcall && n > previouscounter) {
				var text = n - previouscounter > 1 ? "Nouvelles notifications" : "Nouvelle notification"
				$notifcounter.attr('title', text);
				if (n == 0) return ;
				$notifcounter.tooltip('show');
				$("body").one( "click", function() {
				  $notifcounter.tooltip('hide');
				});
				var csrf = $("input[name='_token']").first().val();
				var not_options = {
					badge: "https://logs.pasdt.com/images/logo-98.png",
					icon: "https://logs.pasdt.com/images/logo-98.png",
					body: "Une action de votre part est peut-être nécessaire",
					tag: "alert",
					data : {
						notifcount: n,
						last: data.last,
						csrf: csrf
					},
					requireInteraction: false,/* critique ? true : false;*/
					actions: [{
						action: "acknowledge",
						title: "Vu"
					},{
						action: "see",
						title: "Consulter"
					}]
				};
				var types = "";
				for (var i = 0; i < data.last.length; i++) {
					types += (i != 0 ? ", " : "") + data.last[i].type;
				}

				var not_title = "PASDT: Alerte" + (data.last.length > 1 ? "s " : " ") + types;

				if (getNotificationPermission() === 'granted') {
					navigator.serviceWorker.ready.then(function(registration) {
						registration.showNotification(not_title, not_options);
					});
				}
			}
			firstcall = false;
		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});