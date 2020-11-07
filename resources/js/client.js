define(['jquery', 'moment/moment', './components/getURLParameter', './components/notifs'],
	function($, moment, getURLParameter) {
	var adminconfirmed = false;
	$('.revoqmodulebtn').click(function (e) {
		if (!confirm("Retirer la surveillance de ce module ?")) return ;
		var csrf = $("input[name='_token']").first().val();
		var $self = $(this);
		$.ajax({
			url: "/company/"+$self.data('company')+"/module/"+$self.data('id')+"/unlink",
			type: "PUT",
			data: {"_token": csrf}
		}).done(function(e) {
			console.log(e);
			$self.parent().parent().remove();
		});
	});
	$('.vubtn').click(function() {
		var su_company = $('#app').data('su_company');
		if (typeof su_company == 'undefined' || adminconfirmed || (!adminconfirmed
			&& confirm("Masquer cette notification pour le client aussi ?"))) {
			adminconfirmed = true;
			var $tr = $(this).parent().parent();
			var id = $tr.data('id');
			var csrf = $("input[name='_token']").first().val();
			$.ajax({
				url: "/notif/" + id + "/acknowledge",
				type: "POST",
				data: {"_token": csrf}
			}).done(function() {
				if (!$tr.hasClass('success')) {
					var $counter = $('.notif-counter');
					var value = +$counter.html() -1;
					$counter.html(value != 0 ? value : '');
				}
				$tr.remove();
			});
		}
	});
	// var $toggleNotif = $('#toggleNotif');
	// if ("Notification" in window && Notification.permission === "granted") {
	// 	$toggleNotif.prop("disabled", true);
	// }
	// $toggleNotif.on('click', function() {
	// 	// Let's check if the browser supports notifications
	// 	if (!("Notification" in window)) {
	// 		alert("Ce navigateur ne supporte pas les notifications.");
	// 		return ;
	// 	}

	// 	// Let's check whether notification permissions have already been granted
	// 	else if (Notification.permission === "granted") {
	// 		$toggleNotif.prop("disabled", true);
	// 	}

	// 	// Otherwise, we need to ask the user for permission
	// 	else if (Notification.permission !== "denied") {
	// 		Notification.requestPermission().then(function (permission) {
	// 			// If the user accepts, let's create a notification
	// 			if (permission === "granted") {
	// 				$toggleNotif.prop("disabled", true);
	// 			}
	// 		});
	// 	}
	// 	// At last, if the user has denied notifications, and you 
	// 	// want to be respectful there is no need to bother them any more.
	// });

	$('#toggleNotifStatus').prop("checked", localStorage.getItem('notification-permission') === "granted")
	.on('click', function toggleNotificationpermission(e) {
		var input = e.target;
		$('#notif-error').addClass('d-none');
	    if (Notification.permission === 'granted') {
	        localStorage.setItem('notification-permission', input.checked ? 'granted' : 'denied');
	    } else if (Notification.permission === 'denied') {
	        localStorage.setItem('notification-permission', 'denied');
	        input.checked = false;
			$('#notif-error').removeClass('d-none');
	    } else if (Notification.permission === 'default') {
	        Notification.requestPermission(function(choice) {
	            if (choice === 'granted') {
	                localStorage.setItem('notification-permission', input.checked ? 'granted' : 'denied');
	            } else {
	                localStorage.setItem('notification-permission', 'denied');
	                input.checked = false;
	            }
	        });
	    }
	});
	var $logs = $('#notifTable > tbody > tr');
	$logs.each(function() {
		var created = moment($(this).children('.created_at').html());
		var $updated = $(this).children('.updated_at');
		if ($(this).hasClass('success')) {
			var nowdate = moment($updated.html());
		} else {
			var nowdate = moment();
		}
		$updated.html(moment.duration(nowdate.diff(created)).humanize())
	});

	$('#notifTable .view-notif').on('click', function (e) {
		var id = $(this).parent().parent().data('module_id');
		var company = getURLParameter("company");
		localStorage.setItem('opened-tab', 'home-tab');
		window.location = "/consultation?moduleid=" + encodeURI(id)
		+ (typeof company != 'undefined' ? "&company=" + company : "");
	} );
});