define(['jquery'], function($) {
	$('.sev_check').click(function() {
	    $('.sev_check').not(this).prop('checked', false);
	});
});