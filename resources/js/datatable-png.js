$(function () {
	$('body').on('click', '#imgid', function() {
		console.log('show');
  		$('#visib').toggle();
  		$("#imgid").toggleClass('cursor');
	});
})
