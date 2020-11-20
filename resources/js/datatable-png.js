$(function () {
	$('body').on('click', '#imgid', function() {
  		$('#visib').toggle();
  		$("#imgid").toggleClass('cursor');
	});
})
