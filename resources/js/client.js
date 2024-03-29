define(['jquery', 'moment/moment', './components/getURLParameter',
		"./components/syntaxHighlight", "./components/lang", "./components/moment-fr",
		'./components/notifs', "./dependencies/jquery.ajaxSubmit", "bootstrap4-toggle"],
	function($, moment, getURLParameter, syntaxHighlight, lang) {
	if (location.pathname !== "/client") return ;
	var adminconfirmed = false;
	if (typeof locale != "undefined" && locale != "en-us" && typeof moment_locale !== "undefined") {
		moment.updateLocale(locale.split("-")[0], moment_locale);
	}
	if ('serviceWorker' in navigator) {
        if (localStorage.getItem('allow-service-worker') === "NO") {
			$('#if-not-cached').removeClass('d-none');
			$('#if-cached').addClass('d-none');
		}
	} else {
		$('#browser-cache-settings').addClass('d-none');
	}

	$('#notifTable > tbody > tr').each(function() {
		var $this = $(this);
		var format = (locale === "en-us" ? "MM/DD/YY" : "DD/MM/YY") + " [" + lang("at") + "] HH:mm";
		var $created = $this.children('.created_at');
		var created = moment($created.html());
		var $resolved = $this.children('.resolved_at');
		var success = $this.hasClass('success');
		var nowdate = moment(success ? $resolved.html() : undefined);
		$resolved.html((success ? lang("During") : lang("Since")) + " "
			+ moment.duration(nowdate.diff(created)).humanize());
		$created.html(created.calendar({sameElse: "[" + lang("The") + "] " + format}).capitalize());
	});
	$(".deleteLink").click((e) => {
		e.preventDefault();
		if (confirm(lang(`You are about to permanently delete this user`) + "\n" + lang(`Are you sure`) + "?")){
			$.ajax({
				url: $(this).attr("href")
			})
			.done((data) => {
				$('#user-error').addClass('d-none');
				$(this).parents('tr').remove();
			}).fail((jqXHR, textStatus ) => {
				$('#user-error').removeClass('d-none');
				console.err(textStatus);
				if (textStatus && textStatus.error && textStatus.error.length) {
					$("#user-error > .error-msg").html(textStatus.error)
				}
			});
		}
	});
	$('.revoqmodulebtn').click(function (e) {
		if (!confirm(lang("Stop monitoring this module?"))) return ;
		var csrf = $("input[name='_token']").first().val();
		var $self = $(this);
		$.ajax({
			url: "/company/"+$self.data('company')+"/module/"+$self.data('id')+"/unlink",
			type: "PUT",
			data: {"_token": csrf}
		}).done(function(e) {
			$self.parent().parent().remove();
		});
	});
	$('.rendermailbtn').click(function() {
		var $tr = $(this).parent().parent().parent();
		var id = $tr.data('id');
		var $modalrendermail = $('#modalRenderMail');
		$modalrendermail.find('.bodymail').html('<div class="container"><div class="row"><div class="col-4 mx-auto text-center">'
			+ '<img src="/images/loader.svg" alt="' + lang('Loading...') + ' height="100" width="100"></div><div></div>');
		$.get("/notif/" + id + "/renderMail")
			.done(function(mailhtml) {
				$modalrendermail.find('.bodymail').html(mailhtml);
			})
			.fail(function(e) { $modalrendermail.find('.bodymail').html(e.responseJSON.message) });
		$modalrendermail.modal("show");
	});

	$('.modif-btn-user').click( (e) => {
		const $elt = $(e.currentTarget);
		const $elt_tr = $elt.parents().eq(2);
		const user_id = $elt_tr.children("td.id").html();
		const $user_name = $elt_tr.children("td.name");
		const $user_email = $elt_tr.children("td.email");
		const $user_update = $elt_tr.children("td.updated_at");
		$('#edit-user-modal').ready(() => {
			const $form = $('#modifyUserForm');
			$form.attr('action', '/users/modify/' + user_id.toString());
			const $inputs = $form.find("input:not([type='hidden'])");
			//find input name and put last value
			const $input_name = $.grep($inputs, function(e){ return e.id == "name"; });
			$input_name[0].value = $user_name.html();
			//find input email and put last value
			const $input_email = $.grep($inputs, function(e){ return e.id == "email"; });
			$input_email[0].value = $user_email.html();
			$("#modifyUserForm").ajaxSubmit({
				success: function (e) {
					$inputs.each((index, input) => {
						$(input)[0].value = '';
					})
					$('#edit-user-modal').modal('hide');
					$user_name.html(e.name);
					$user_email.html(e.email);
					const update_at = moment(e.updated_at).format("YYYY-MM-DD HH:mm:ss");
					$user_update.html(update_at);
				}
			});
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

	/* json modal*/
	$('#jsonModal').on('show.bs.modal', function (e) {
  		var id = $(e.relatedTarget).parents("td").siblings(".id").data("real-id");
  		var $this = $(this);
  		$.getJSON("/module/" + id + "/json")
  		.done(function(telit_json) {
  			$this.find('pre').html(syntaxHighlight(JSON.stringify(telit_json, null, 2)));
  		})
  		.fail(function(e) {
  			$this.find('pre').html(lang("JSON data missing"));
  		});
	});
	/* module alerts modal*/
	$('#modalModuleThresholds').on('show.bs.modal', function (e) {
  		var id = $(e.relatedTarget).parents("td").siblings(".id").data("real-id");
  		var $this = $(this);
  		$("#moduleThresholdForm").attr("data-id", id);
  		$body = $this.find('modal-body');
  		$formloader = $this.find('.form-loader').removeAttr("hidden");
  		$.getJSON("/module/" + id + "/thresholds")
  		 .done(function(thresholds_json) {
  			Object.entries(thresholds_json).forEach(([key, val]) => {
  				if (val === null) {
  					$("#" + key + "-disable").bootstrapToggle('off');
  				} else {
	  				$("#" + key).val(val);
  				}
			});
  			$formloader.prop("hidden", true);
  		})
  		.fail(function(e) {
  			$body.html(lang("JSON data missing"));
	  		$formloader.prop("hidden", true);
  		});
  		$this.find('.modal-title > span')
  			 .html($(e.relatedTarget).parents("td").siblings(".name").html());
  		$this.find('form').attr('action', "/module/" + id + "/thresholds")
  			 .find("input:not([type='hidden'])").each(function() {
  				$input = $(this);
  				$input.attr('name', $input.attr('id'))
  					   .val($input.attr('placeholder'))
  					   .removeClass('is-invalid');
  			 });
  		$this.find('.form-message').addClass('d-none');
  		$this.find('input[data-toggle="toggle"]').bootstrapToggle('on')
	});

	$("#moduleThresholdForm").ajaxSubmit({
		data: function() {
            /* unchecked inputs are disabled inputs */
			var ret = $(this).find("input:not(:checked):not([type='hidden'])").serialize();
			$(this).find('input[type="checkbox"]:not(:checked):not([type="hidden"])').each(function(e){
				ret += (ret.length ? "&" : "") + this.id
			});
			return ret;
	    },
		url: function() {
	      return $(this).attr('action');
	    },
		before: function() {
			$(this).find('input:not([type="hidden"])').each(function(i) {
				$this = $(this);
				if (($this.val() == "" && !$this[0].checked) || $this.val() == $this.attr("placeholder")) {
					$this.attr("name", "");
				} else {
					$this.attr("name", $this.attr("id"));
				}
			});
			return true;
		},
		success: function (e) {
			var lookout_id = $(this).data("id");
			var presynths = JSON.parse(sessionStorage.getItem("synth")) || presynths || [];
			var mod_index = presynths.findIndex(p => p.id === lookout_id);
			if (mod_index != -1) {
				presynths[mod_index].thresholds = JSON.stringify(e);
			    sessionStorage.setItem("synth", JSON.stringify(presynths));
			}
			/*var pretemps = JSON.parse(sessionStorage.getItem("temps")) || {};
			delete pretemps[lookout_id];
			sessionStorage.setItem("synths", JSON.stringify(pretemps));*/
			$("#modalModuleThresholds").modal('hide');
		},
		error: function(res, err) {
			$('#moduleThresholdForm .form-message').html(res.message);
		},
		messageErrorClasses: "col-12 alert alert-danger",
		showInvalid: function(input) {
			$(input).addClass('is-invalid');
		}
	});

	$('input[data-toggle="toggle"]').change(function(e) {
        /* unchecked inputs are disabled inputs */
    	$("#" + this.id.substring(0, this.id.indexOf("-disable"))).prop("disabled", !this.checked);
    })
	/* textarea */
	$("#comment").keyup(setTextAreaCounter);

	function setTextAreaCounter() {
		var length = $("#comment").val().length;
	  	$("#count").text(length > 100 ? (255 - length) + " / 255" : "");
	}
	$('.vubtn').click(function() {
		var su_company = $('#app').data('su_company');
		var $this = $(this);
		if (typeof su_company == 'undefined' || adminconfirmed || (!adminconfirmed
			&& confirm(lang("Stop monitoring this module?")))) {
			adminconfirmed = true;
			var $tr = $this.parent().parent().parent();
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
					sessionStorage.setItem("notif-counter", value);
					$counter.html(value != 0 ? value : '');
				}
				$this.tooltip('dispose');
				$tr.remove();
			});
		}
	});

	$('.module-mail-btn').on('click', function(e) {
		var $this = $(this);
		var id = $this.parents("td").siblings(".id").data("real-id");
		var modifbtn = $this.parent().siblings(".btn-group").children('.modifbtn')[0];
		modifbtn.disabled = !e.target.checked;
		$.ajax({
			url: "/module/" + id + "/toggle-mail/" + (e.target.checked ? "1" : "0"),
			type: "PUT"
		}).done(function(data) {
			$('#mail-module-error').addClass('d-none');
		}).fail(function() {
	    	e.target.checked = !e.target.checked;
			$('#mail-module-error').removeClass('d-none');
			modifbtn.disabled = !e.target.checked;
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

	$('#localeform').on("submit", function() {
		if ('serviceWorker' in navigator) {
		    navigator.serviceWorker.getRegistrations().then(function(registrations) {
		    for(let registration of registrations) {
		        registration.unregister()
		    } })
		}
	});

	$('#empty-cache').on('click', function() {revokeServiceWorker(false)});
	$('#no-service-worker').on('click', function() {revokeServiceWorker(true)});
	function revokeServiceWorker(save_choice) {
		if (save_choice) {
			localStorage.setItem('allow-service-worker', 'NO');
		} else {
			localStorage.removeItem('allow-service-worker');
		}
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistrations().then(function(registrations) {
				for (let registration of registrations) {
					registration.unregister();
				}
			});
		};
		setTimeout(function() {
			location.href = '/';
		}, 500)
	}
});
