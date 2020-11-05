define(['jquery', 'moment/moment', './components/notifs'], function($, moment) {
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
				if ($tr.hasClass('success')) {
					var $counter = $('.notif-counter');
					var value = +$counter.html() -1;
					$counter.html(value != 0 ? value : '');
				}
				$tr.remove();
			});
		}
	});
	var $nologs = $('.no_log.success');
	$nologs.each(function() {
		var created = moment($(this).children('.created_at').html());
		var $updated = $(this).find('.moment-now');
		$updated.html(moment.duration(moment($updated.html()).diff(created)).humanize())
				.removeClass('d-none');
	})
});