define(['jquery'], function($) {
	$noday = $("#noday");
	$notemp = $("#notemp");
	function initNopingButtons(table) {
		$noday.click(function(e) {
			cumulative_filter(table, true, false);
		});
		$notemp.click(function(e) {
			cumulative_filter(table, false, true);
		});
		cumulative_filter(table, false, false);

		$('th[class^="sorting"]').click(function() {
		    cumulative_filter(table, false, false);
		});
		
		$('#main-table, .dataTables_filter').on("change click keyup", 'input, select', function() {
		    cumulative_filter(table, false, false);
		})
		
	}


	function cumulative_filter(table, ping_toggle, temp_toggle) {
		// ping
		var toggle_ping_value = localStorage.getItem('noping') === "true";
		toggle_ping_value = ping_toggle ? !toggle_ping_value : !!toggle_ping_value;
		localStorage.setItem('noping', toggle_ping_value);
		$noday.toggleClass('btn-dark', toggle_ping_value);

		// temp
		var toggle_temp_value = localStorage.getItem('notemp') === "true";
		toggle_temp_value = temp_toggle ? !toggle_temp_value : !!toggle_temp_value;
		localStorage.setItem('notemp', toggle_temp_value);
		$notemp.toggleClass('btn-dark', toggle_temp_value);

		$.fn.dataTable.ext.search.push(
	        function( settings, data, dataIndex ) {
	        	var ret = true;
	        	if (toggle_ping_value) {
	            	ret = data[3] != 'Day' && data[3] != 'Acquittement' && data[3] != 'Test';
		        	if (ret && toggle_temp_value) {
		            	ret = data[4] != '--';// && +data[4] < 700 && +data[4] > -98;
		        	}
	        	} else if (toggle_temp_value) {
	        		ret = data[4] != '--';// && +data[4] < 700 && +data[4] > -98;
	        		if (ret && toggle_ping_value) {
		            	ret = data[3] != 'Day' && data[3] != 'Acquittement' && data[3] != 'Test';
		        	}
	        	}
	        	window.toggle_temp = toggle_temp_value;
	        	return ret;
	        }
	    );
	    table.draw();
	    $('#main-table').find('.th-message').html(toggle_ping_value ? 'Anomalies' : 'Message');
	    $('#main-table').find('.th-input-message input').attr('placeholder', toggle_ping_value ? 'Rechercher Anomalie' : 'Rechercher Message');
	    $.fn.dataTable.ext.search.pop();
	}
	return {
		initNopingButtons: initNopingButtons,
		cumulative_filter: cumulative_filter
	};
});
