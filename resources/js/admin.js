define(["jquery", "./bootstrap"], function($) {
    if (!window.location.pathname.includes("admin")) return ;
	$('#edit-user-modal').on('shown.bs.modal', function (e) {


	})

	$('.revoqbtn').click(function(e) {
		var id = $(this).parent().siblings('.id').html();
		var $p = $(this).parent();
		var n = $p.siblings('.name').html();
		if (confirm('Supprimer le compte de ' +  n + ' ?')) {
			console.log('should delete', id);
			location.href='/user/delete/' + id;
		}
	});

	$('.modifbtn').click(function(e) {
		var $p = $(this).parent();
		var id = $p.siblings('.id').html();
		$('#name').val($p.siblings('.name').html());
		$('#email').val($p.siblings('.email').html());
		//$('#name').val($p.siblings('.name').html());

	});


	$('#colors').on('change', function(e) {
		$('body').css('background-color', $(this).val());
	})


	$('.companybtn').click(function(e) {
		console.warn('clicked');
		var id = $(this).attr('id');
		$.getJSON("/company/"+id+"/users", function(users) {
			console.warn('res', users);
            $('#companyUsersModal').modal("show");
          })
        });
});	