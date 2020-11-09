define(['jquery', 'moment/moment', './components/getURLParameter',
		'./components/notifs', "./dependencies/jquery.ajaxSubmit"],
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
	$('.rendermailbtn').click(function() {
		var $tr = $(this).parent().parent().parent();
		var id = $tr.data('id');
		$.get("/notif/" + id + "/renderMail")
			.done(function(mailhtml) {
				$('#modalRenderMail').find('.bodymail').html(mailhtml);
				$('#modalRenderMail').modal("show");
			})
			.fail(function() {
			});
	});
	
	$('.commentbtn').on('click', function() {
		var $tr = $(this).parent().parent().parent();
		openCommentModal($tr);
	});
	$('.comment').on('click', function() {
		var $tr = $(this).parent();
		openCommentModal($tr);
	});
	function openCommentModal($tr) {
		var id = $tr.data('id');
		$('.message-error').addClass('d-none');
		$('#modalComment').modal('show')
						  .find('form').prop('action', "/notif/" + id + "/comment").attr('data-id', id)
						  .find('textarea').val($tr.find('.comment-text').html());
		setTextAreaCounter();
	}
	$('#commentform').ajaxSubmit({
		success: function(e) {
			$('.message-error').addClass('d-none');
			$("#modalComment").modal('hide');
			$('tr[data-id="' + $(this).attr('data-id') + '"] .comment-text').html(e.comment);
		},
		error: function(e) {
			$('.message-error').removeClass('d-none');
		}
	});
	/* textarea */
	$("#comment").keyup(setTextAreaCounter);

	function setTextAreaCounter() {
		var length = $("#comment").val().length;
	  	$("#count").text(length > 100 ? (255 - length) + " / 255" : "");
	}
	$('.vubtn').click(function() {
		var su_company = $('#app').data('su_company');
		if (typeof su_company == 'undefined' || adminconfirmed || (!adminconfirmed
			&& confirm("Masquer cette notification pour le client aussi ?"))) {
			adminconfirmed = true;
			var $tr = $(this).parent().parent().parent();
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

	$('#toggleMailStatus')
	.on('click', function toggleMailpermission(e) {
		var input = e.target;
		$('#mail-error').addClass('d-none');
	    $.post('/user/mailnotifs/' + (input.checked ? 1 : 0))
	    .done(function(e) {
	    }).fail(function(e) {
	    	input.checked = !input.checked;
			$('#mail-error').removeClass('d-none');
	    })
	});
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
		var $resolved = $(this).children('.resolved_at');
		if ($(this).hasClass('success')) {
			var nowdate = moment($resolved.html());
		} else {
			var nowdate = moment();
		}
		$resolved.html(moment.duration(nowdate.diff(created)).humanize())
	});

	$('#notifTable .view-notif').on('click', function (e) {
		var id = $(this).parent().parent().parent().data('module_id');
		var company = getURLParameter("company");
		localStorage.setItem('opened-tab', 'home-tab');
		window.location = "/consultation?moduleid=" + encodeURI(id)
		+ (typeof company != 'undefined' ? "&company=" + company : "");
	});
});