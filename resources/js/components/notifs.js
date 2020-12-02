define(['jquery', './getURLParameter', './lang'], function($, getURLParameter, lang) {
	var firstcall = true;
	var admincomp = getURLParameter("company");
	if (window.location.pathname.indexOf("password") != -1) return ;
	function getNotificationPermission() {
	    if ("Notification" in window && Notification.permission === 'granted') {
	        return localStorage.getItem('notification-permission');
	    } else {
	        return Notification.permission;
	    }
	}

	function setCSRF(csrf) {
		$('meta[name="csrf-token"]').attr('content', csrf);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': csrf
            }
        });
	}

	function getNotif() {
		$.getJSON("/notifs/count_last" + (admincomp ? "?company=" + admincomp : ""))
		.done(function(data) {
			setCSRF(data.csrf);

			n = +data.count;
			$notifcounter = $('.notif-counter');
			previouscounter = +$notifcounter.html();
			$notifcounter.html(n != 0 ? n : '');
			if (!firstcall && n > previouscounter) {
				var text = n - previouscounter > 1 ? lang("New notification") : lang("New notifications")
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
					body: lang("An action on your part may be needed."),
					tag: "alert",
					data : {
						notifcount: n,
						last: data.last,
						csrf: csrf
					},
					requireInteraction: false,/* critique ? true : false;*/
					actions: [{
						action: "acknowledge",
						title: lang("Vu")
					},{
						action: "see",
						title: lang("Consulter")
					}]
				};
				var types = "";
				for (var i = 0; i < data.last.length; i++) {
					types += (i != 0 ? ", " : "") + data.last[i].type;
				}

				var not_title = "PASDT: " + (data.last.length > 1 ? "Alerts " : "Alert ") + types;

				if (getNotificationPermission() === 'granted') {
					navigator.serviceWorker.ready.then(function(registration) {
						registration.showNotification(not_title, not_options);
					});
				}
			}
			firstcall = false;
		})
		.fail(function(r) {
	    	var event = new CustomEvent("offline", { detail: {request: "csrf", data: r }});
			document.dispatchEvent(event);
		});
	}
	setInterval(getNotif, 5 * 60 * 1000);
	getNotif();
});