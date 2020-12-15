define(['jquery', 'js-cookie', './graphic-rendering', 'moment', /*'./dependencies/moment-fr.js',*/
	'./components/cache', './components/notifs', './bootstrap', 'bootstrap'],
function($, cookie, graph_annotated, moment) {
	$('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		// e.target // newly activated tab
		// e.relatedTarget // previous active tab
		$('table.dataTable').DataTable().fixedHeader.adjust();
		localStorage.setItem('opened-tab', e.target.getAttribute('id'));
	});
    $('#graphs-live-tab').on("click", function () {
		$.ajaxSetup({cache: true});

  		$.getScript("/js/anychart-bundle.js")
  		.done(function() {
     		graph_annotated.init();
  		});
		
		var cssLink = $("<link>");
		$("head").append(cssLink); //IE hack: append before setting href
		cssLink.attr({
		  	rel:  "stylesheet",
		  	type: "text/css",
		  	href: "/css/anychart-ui.min.css"
		});
  		$.ajaxSetup({cache: false});
    });

	$('#logoff-button, #reconnect-button').on("click", function(event) {
		event.preventDefault();
       	if(window.navigator && navigator.serviceWorker) {
          	navigator.serviceWorker.getRegistrations()
          	.then(function(registrations) {
	            for(let registration of registrations) {
	              registration.unregister();
	            }
          	});
        }
        document.getElementById('logout-form').submit();
	});
	$(function() {
		if (location.pathname === "/consultation" || location.pathname === "/") {
			var opened_tab = localStorage.getItem('opened-tab') || 'synthesis-tab';
			$('#' + opened_tab).click();
		}	
	})
});