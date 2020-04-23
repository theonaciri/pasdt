define(["jquery", "moment/moment"/*, "anychart", "anychart-jquery"*/], function($) {
	
	function init() {
		var a = new Date("2020-04-18 13:40:24");
		$.getJSON("/logs/temp", {from: a.toJSON()})
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

	function transformData(temp_data) {
		for (var i = temp_data.length - 1; i >= 0; i--) {
			temp_data[i].created_at = new Date(temp_data[i].created_at).toUTCString();
		}
	}

	function onDataReceive(data) {
		var date_options = {month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"};
		// chart type
		var chart = anychart.line();

		// chart title
		chart.title("Line Chart DateTime Scale");

		// set X axis labels formatter
		// create custom Date Time scale
		var dateTimeScale = anychart.scales.dateTime();
		var dateTimeTicks = dateTimeScale.ticks();
		dateTimeTicks.interval(0, 6);
		// apply Date Time scale
		chart.xScale(dateTimeScale);
  		chart.xScale(dateTimeScale);
		chart.xAxis().labels().format(function () {
			return new Date(this.value).toLocaleDateString("fr-FR", date_options);
		});

		// set Y axis label formatter
		chart.yScale().minimum(-20);
		chart.yScale().maximum(90);

		// data
		transformData(data.temps);
		// create a data set
		var dataSet = anychart.data.set(data.temps);

		// map the data
	    var mapping = dataSet.mapAs({value: "maxtemp", x: "created_at"});
		var series = chart.line(mapping);


		// set series stroke settings
		series.stroke({
			angle: 90,
			keys: ['#2fa85a', '#ecef17', '#ee4237'],
			thickness: 3
		});
		// adjust tooltips
		var tooltip = series.tooltip();
		tooltip.format(function () {
			var value = (this.value).toFixed(0);
			var date = new Date(this.created_at);
			var transformedDate =  date.toLocaleDateString("fr-FR", date_options);

			return "Temp: " + value + "°C.\nLe " + transformedDate ;
		});

		// set container and draw chart
		chart.container("anychart");
		chart.draw();
	}
	function onDataReceive0(data) {
		//$('#anychart').anychart('column', [3, 1, 2]);

		transformData(data.temps);
		var dataTable = anychart.data.table();
	    dataTable.addData(data.temps);
	    var mapping = dataTable.mapAs({x: "created_at", value: "maxtemp"});

	    var chart = anychart.stock();
	    var line = chart.plot().line(mapping);

	    var rangePicker = anychart.ui.rangePicker();
	    var rangeSelector = anychart.ui.rangeSelector();

		// apply Date Time scale
	    var dateScale = anychart.scales.dateTime();
		var dateTicks = dateScale.ticks();
		dateTicks.interval(0,6);
  		chart.xScale(dateScale);


  		// adjust tooltips
		var tooltip = line.tooltip();
		tooltip.format(function () {
			var value = (this.maxtemp).toFixed(0);
			var date = new Date(this.x);
			var options = {year: "numeric", month: "numeric", day: "numeric"};
			var transformedDate =  date.toLocaleDateString("fr-FR", options);

			return "Value: $" + value + " mil.\n" + transformedDate ;
		});

	    chart.title("Render the range selectors into a chart instance");

		line.stroke({
			angle: 90,
			keys: ['#2fa85a', '#ecef17', '#ee4237'],
			thickness: 3
		});
	    chart.container("anychart");
	    chart.draw();
		window.thischart = chart;
	    // Render the range picker into an instance of a stock chart
	    rangePicker.render(chart);
	    rangeSelector.render(chart);
	}
	return {init: init};
});