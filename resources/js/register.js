define(['jquery', './components/getURLParameter'], function($, getURLParameter) {
	$('.sev_check').click(function() {
	    $('.sev_check').not(this).prop('checked', false);
	});
	var company = getURLParameter("company");
	if (company) {
		$("#company").val(company);
	}
});