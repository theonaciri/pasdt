define(['jquery', 'moment/moment', './components/getURLParameter',
		"./components/syntaxHighlight", "./components/lang", "./components/moment-fr",
		'./components/notifs', "./dependencies/jquery.ajaxSubmit"],
	function($, moment, getURLParameter, syntaxHighlight, lang) {
	var adminconfirmed = false;
	$('.revoqmodulebtn').click(function (e) {
		if (!confirm(lang("Stop monitoring this module?"))) return ;
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
		var $modalrendermail = $('#modalRenderMail');
		$modalrendermail.find('.bodymail').html('<div class="container"><div class="row"><div class="col-4 mx-auto text-center"><img src="/images/loader.svg" height="100"></div><div></div>');
		$.get("/notif/" + id + "/renderMail")
			.done(function(mailhtml) {
				$modalrendermail.find('.bodymail').html(mailhtml);
			})
			.fail(function(e) { $modalrendermail.find('.bodymail').html(e.responseJSON.message) });
		$modalrendermail.modal("show");
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

	/* json modal*/
	$('#jsonModal').on('show.bs.modal', function (e) {
  		var id = $(e.relatedTarget).parent().siblings(".id").html();
  		var $this = $(this);
  		$.getJSON("/module/" + id + "/json")
  		.done(function(telit_json) {
  			$this.find('pre').html(syntaxHighlight(JSON.stringify(telit_json, null, 2)));
  		})
  		.fail(function(e) {
  			$this.find('pre').html(lang("JSON data missing"));
  		});
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
			&& confirm(lang("Stop monitoring this module?")))) {
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

	$('.module-mail-btn').on('click', function(e) {
		var id = $(this).parent().parent().siblings(".id").html();
		$.ajax({
			url: "/module/" + id + "/toggle-mail/" + (e.target.checked ? "1" : "0"),
			type: "PUT"
		}).done(function(data) {
			$('#mail-module-error').addClass('d-none');
		}).fail(function() {
	    	e.target.checked = !e.target.checked;
			$('#mail-module-error').removeClass('d-none');
		});
	});

	$('#toggleMailStatus')
	.on('click', function toggleMailpermission(e) {
		var input = e.target;
		$('#mail-error').addClass('d-none');
	    $.post('/user/mailnotifs/' + (input.checked ? 1 : 0))
	    .done(function(e) {
			$('#mail-error').addClass('d-none');
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
	if (typeof locale != "undefined" && locale != "en-us" && typeof moment_locale !== "undefined") {
		moment.updateLocale(locale.split("-")[0], moment_locale);
	}
	var $logs = $('#notifTable > tbody > tr');
	
	$logs.each(function() {
		var format = (locale === "en-us" ? "MM/DD/YY" : "DD/MM/YY") + " [" + lang("at") + "] HH:mm";
		var $created = $(this).children('.created_at');
		var created = moment($created.html());
		var $resolved = $(this).children('.resolved_at');
		var success = $(this).hasClass('success');
		var $nologvalue = $(this).find('.nolog-value')
		if ($nologvalue.length) {
			$nologvalue.html(lang("The") + " " + moment($nologvalue.html()).format(format));
		}
		if (success) {
			var nowdate = moment($resolved.html());
		} else {
			var nowdate = moment();
		}
		$resolved.html((success ? lang("During") + " " : lang("Since") + " ")
			+ moment.duration(nowdate.diff(created)).humanize())
			.prop('title', success ? lang("Solved the : ") + nowdate.format(format) : lang("Still ongoing"))
			.tooltip('_fixTitle');
		$created.html(created.calendar({sameElse: "[" + lang("The") + "] " + format}).capitalize())
				.prop('title', lang("First occurence the : ") + created.format(format))
				.tooltip('_fixTitle');
	});

	$('#notifTable .view-notif').on('click', function (e) {
		var id = $(this).parent().parent().parent().data('module_id');
		var company = getURLParameter("company");
		localStorage.setItem('opened-tab', 'home-tab');
		window.location = "/consultation?moduleid=" + encodeURI(id)
		+ (typeof company != 'undefined' ? "&company=" + company : "");
	});
	$('#localeform').on("submit", function() {
		if ('serviceWorker' in navigator) {
		    navigator.serviceWorker.getRegistrations().then(function(registrations) {
		    for(let registration of registrations) {
		        registration.unregister()
		    } })
		}
	})
});
