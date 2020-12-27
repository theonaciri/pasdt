define(['jquery'], function($) {
    if (window.location.pathname.indexOf("password") != -1) return ;
    /* CSRF is now gotten in the notif.js file */
	var $disconnectedText = $('#disconnected-header');
	var $backonlineText = $('#backonline-header');

    document.addEventListener("offline", function(e) {
    	console.error('OFFLINE', e);
    	window.offline = true;
    	$disconnectedText.removeClass("d-none").tooltip('show');
    	setTimeout(function() {
    		$disconnectedText.tooltip('hide');
    	}, 8000);
    	if (e.detail.data.status === 403 || e.detail.data.status === 419) {
    		navigator.serviceWorker.getRegistrations().then(function(registrations) {
				for(let registration of registrations) {
			 	registration.unregister()
			} })
			setTimeout(function() {
    			window.location.href = "/";
			}, 1000)
    	}
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
});