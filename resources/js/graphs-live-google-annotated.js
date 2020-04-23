define(["jquery", "moment/moment"/*, "anychart", "anychart-jquery"*/], function($) {
	var chart = null;
	var data = null;
	var theme = localStorage.getItem('graph-theme') || "defaultTheme";

	function init() {
		var a = new Date("2020-04-18 13:40:24");
		$.getJSON("/logs/temp", {from: a.toJSON()})
		.done(function(_data) {
			$(document).ready(function() {
				data = _data;
				onDataReceive(theme);
				//auto_update();
			});
		})
		.fail(function( jqxhr, textStatus, error ) {
			console.error( "Request Failed: " + error );
		});

	}
	$('#themeSelect option[value="' + theme + '"]').attr('selected', 'selected');
	$('#themeSelect').on('change', function (){
	  	// recreate chart to reset theme
	  	theme = this.value;
	  	onDataReceive();
		localStorage.setItem('graph-theme', this.value);
	});

	function transformData(temp_data) {
		for (var i = temp_data.length - 1; i >= 0; i--) {
			temp_data[i].created_at = new Date(temp_data[i].created_at).toUTCString();
		}
	}

	function onDataReceive() {
		$('#anychart').css("width", (window.innerWidth-100) + "px").css('height', (window.innerHeight -300) + "px")
		if (chart != null) chart.dispose();
		// set theme
  		anychart.theme(theme);  


		var date_options = {month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"};
		// chart type
		chart = anychart.line();

		// chart title
		chart.title("Evolution des températures des modules");

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
			var date = new Date(this.x);
			var transformedDate =  date.toLocaleDateString("fr-FR", date_options);
			return "Temp: " + value + "°C.\nLe " + transformedDate ;
		});

		// set container and draw chart
		chart.container("anychart");
		chart.draw();
	}
	return {init: init};
});