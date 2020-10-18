define(['jquery', './polyfill-dispatch-event',], function($) {
	var $disconnectedText = $('#disconnected-header');
	var $backonlineText = $('#backonline-header');
	$disconnectedText.tooltip({ trigger: "hover" });
    document.addEventListener("offline", function(e) {
    	console.error('OFFLINE');
    	window.offline = true;
    	$disconnectedText.removeClass("d-none").tooltip('show');
    	setTimeout(function() {
    		$disconnectedText.tooltip('hide');
    	}, 5000);
    });

    document.addEventListener("online", function(e) {
    	if (window.offline) {
    		console.error('ONLINE');
    		$disconnectedText.addClass("d-none").tooltip('hide');
	    	var event = new CustomEvent("backonline", { detail: {request: e.request, data: e.data }});
			document.dispatchEvent(event);
    	}
    	window.offline = false;
    });
    document.addEventListener("backonline", function(e) {
    	if (e.detail.request === 'csrf') { return ;}
    	console.error('BACK ONLINE');
    	$backonlineText.removeClass('d-none');
    	setTimeout(function() {
    		$backonlineText.addClass('d-none');
    	}, 5000);
    });

	/* CSRF refresh for cached pages */
	$.ajax({
	    url: "/csrf",
	    type: 'get',
	    dataType: 'json'
	}).done(function (result) {
        $('meta[name="csrf-token"]').attr('content', result.token);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': result.token
            }
        });
		// Create the event
		var event = new CustomEvent("backonline", { detail: {request: "csrf", data: result }});
		// Dispatch/Trigger/Fire the event
		document.dispatchEvent(event);
    }).fail(function(r) {
    	var event = new CustomEvent("offline", { detail: {request: "csrf", data: r }});
		document.dispatchEvent(event);
    });
});