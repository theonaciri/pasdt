define(["jquery", "./bootstrap"], function($) {
    if (window.location.pathname !== "/admin") return ;
	$('#edit-user-modal').on('shown.bs.modal', function (e) {
		console.warn('e', e);
		$target = $(e.target);
		$target.trigger('focus');
	})

	$('.revoqbtn').click(function(e) {
		var id = $(this).parent().siblings('.id').html();
		
	});
});