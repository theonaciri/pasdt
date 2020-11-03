define(['jquery', 'moment/moment', './components/notifs'], function($, moment) {
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
		var $self = $(this);
		var id = $self.parent().parent().data('id');
		var csrf = $("input[name='_token']").first().val();
		$.ajax({
			url: "/notif/" + id + "/acknowledge",
			type: "POST",
			data: {"_token": csrf}
		}).done(function() {
			$self.parent().parent().remove();
			$counter =$('.notif-counter');
			$counter.html(+$counter.html() -1);
		});
	});
	var $nologs = $('.no_log.success');
	$nologs.each(function() {
		var created = moment($(this).children('.created_at').html());
		var $updated = $(this).find('.moment-now');
		$updated.html(moment.duration(moment($updated.html()).diff(created)).humanize())
				.removeClass('d-none');
	})
});