define(['js-cookie', './graphs-live-google-annotated'], function(cookie, graph_annotated) {
	window.getUrlParameter = function(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.href);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, '    '));
	};
	var comp = $("#app").data("su_company");
	if (typeof comp != 'undefined') {
		console.log('::', comp);
		cookie.set('su_company', "2", {path: '/'})
	} else if (location.pathname === "/home") {
		cookie.remove('su_company');
	}


	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  // e.target // newly activated tab
	  //e.relatedTarget // previous active tab
	  localStorage.setItem('opened-tab', e.target.getAttribute('id'));
	})
	var opened_tab = localStorage.getItem('opened-tab') || 'synthesis-tab';
	$('#' + opened_tab).click();
	$('.color-modal-button').click(function() {
		$("#colorModal").modal("show");
	})

	if ((location.pathname === "/home" || location.pathname === "/") && opened_tab === 'graphs-live-tab') {
		graph_annotated.init();
	}

    $('#graphs-live-tab').click( function () {
     	graph_annotated.init();
    });

})