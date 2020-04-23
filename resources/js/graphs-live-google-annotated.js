define(["jquery", "moment/moment"/*, "anychart", "anychart-jquery"*/], function($) {
	
	function init() {
		$.getJSON("/logs/temp")
		.done(function(data) {
			$(document).ready(function() {
				onDataReceive(data, true);
				//auto_update();
			});
		})
		.fail(function( jqxhr, textStatus, error ) {
			console.error( "Request Failed: " + error );
		});
	}
	function onDataReceive(data) {
		//$('#anychart').anychart('column', [3, 1, 2]);
		var dataTable = anychart.data.table();
	    dataTable.addData(get_dji_daily_short_data());

	    var mapping = dataTable.mapAs({value: 1});

	    var chart = anychart.stock();

	    var line = chart.plot().line(mapping);

	    var rangePicker = anychart.ui.rangePicker();
	    var rangeSelector = anychart.ui.rangeSelector();

	    chart.title("Render the range selectors into a chart instance");

		line.stroke({
			angle: 90,
			keys: ['#2fa85a', '#ecef17', '#ee4237'],
			thickness: 3
		});
	    chart.container("anychart");
	    chart.draw();

	    // Render the range picker into an instance of a stock chart
	    rangePicker.render(chart);
	    rangeSelector.render(chart);
	}
	return {init: init};
});