define(['jquery', 'js-cookie', './graphic-rendering', 'moment', /*'./dependencies/moment-fr.js',*/
	'./components/cache', './components/notifs', './bootstrap', 'bootstrap'],
	function($, cookie, graph_annotated, moment) {
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		// e.target // newly activated tab
		// e.relatedTarget // previous active tab
		$('table.dataTable').DataTable().fixedHeader.adjust();
		localStorage.setItem('opened-tab', e.target.getAttribute('id'));
	});

    $('#graphs-live-tab').click(function () {
    	var module_names = $('#module-name .selectpicker').val();
        if (Array.isArray(module_names) && module_names.length) {
		  var mod_name = module_names[0];
		  if (Array.isArray(presynths)) {
			var mod = presynths.find(function(m) {return m.name === mod_name});
			if (typeof mod !== 'undefined') {
				$('#graphModuleSelect').val(mod.module_id).trigger('change');
			}
		  }
        }
     	graph_annotated.init();
    });

	var opened_tab = localStorage.getItem('opened-tab') || 'synthesis-tab';
	$('#' + opened_tab).click();

	$('#logoff-button, #reconnect-button').click(function(event) {
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
})