define(['jquery'], function() {
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
});