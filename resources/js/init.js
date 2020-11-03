define(['jquery', 'js-cookie', './graphs-live-google-annotated', './components/cache', './components/notifs', './bootstrap', 'bootstrap'], function($, cookie, graph_annotated) {
	var comp = $("#app").data("su_company");
	if (typeof comp != 'undefined') {
		cookie.set('su_company', "2", {path: '/'})
	} else if (location.pathname === "/consultation") {
		cookie.remove('su_company');
	}	


	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  // e.target // newly activated tab
	  //e.relatedTarget // previous active tab
	  $('table.dataTable').DataTable().fixedHeader.adjust();
	  localStorage.setItem('opened-tab', e.target.getAttribute('id'));
	})
	$('.color-modal-button').click(function() {
		$("#colorModal").modal("show");
	})

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

	$('#logoff-button').click(function() {
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