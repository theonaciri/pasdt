define(["jquery", "moment/moment"/*, "anychart", "anychart-jquery"*/], function($) {
	var $mod_select = $('#graphModuleSelect');
	var chart = null;
	var data = null;
	var theme = localStorage.getItem('graph-theme') || "defaultTheme";
	var active_module = localStorage.getItem('graph-active-module');

	function init() {
		var a = new Date("2020-04-18 13:40:24");
		$.getJSON("/logs/temp", {from: a.toJSON()})
		.done(function(_data) {
			$(document).ready(function() {
				data = _data;
				setModuleSelect();
				onDataReceive();
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
		var filtered_data = data.temps.filter(function(t) {return t.cardId === active_module});
		for (var i = 0; i < filtered_data.length; ++i) {
			filtered_data[i].created_at = new Date(temp_data[i].created_at).toUTCString();
		}
		return filtered_data;
	}

	function setModuleSelect() {
		var first_selected = false;
		var modules_with_data = data.modules.filter(function(m) {
			return !!data.temps.filter(function(t) {
				return t.cardId === m.module_id
			}).length
		});
		for (var i = data.modules.length - 1; i >= 0; i--) {
			var enabled = modules_with_data.find(function(m) {return m.module_id === data.modules[i].module_id});
			$mod_select.append('<option value="' + data.modules[i].module_id + '"'
			+ (!enabled ? 
				' disabled' :
				(!first_selected ? ' selected' : '')
			   )
			+ '>'
			+ data.modules[i].module_id + ' - ' + data.modules[i].name + "</option>");
			first_selected = true;
		}
		active_module = $mod_select.children('option:not([disabled]):first').val();
		$mod_select.on('change', function() {
			active_module = $mod_select.val();
			localStorage.setItem('graph-active-module', active_module);
			onDataReceive();
		})
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
		var filtered_data = transformData(data.temps);
		// create a data set
		// map the data
		var dataSet = anychart.data.set(filtered_data);

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


		//minimap
		// access labels

		// turn on X Scroller
		chart.xScroller(true);
		// turn on Y Scroller
		chart.yScroller(true);

		// set container and draw chart
		chart.container("anychart");
		chart.draw();
	}
	return {init: init};
});