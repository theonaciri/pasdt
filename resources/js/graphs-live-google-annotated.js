define(["jquery", 'moment', "./locales" /*, "anychart", "anychart-jquery"*/], function($, moment, lang) {
window.chart = null;
var $mod_select = $('#graphModuleSelect');
var data = null;
var theme = localStorage.getItem('graph-theme') || "defaultTheme";
var active_module = localStorage.getItem('graph-active-module');
var interval_var = null;
var locale="es-es";

function init() {
	if (chart != null) return ; // only one init;
	var a = new Date("2018-04-25 13:40:24");

	//$('#graphModuleSelect').on('loaded.bs.select', function() {
		$.getJSON("/logs/temp", {from: a.toJSON(), modules: $('#graphModuleSelect').val()})
		.done(function(_data) {
			$(document).ready(function() {
				data = _data;
				setModuleSelect();
				onDataReceive();
			});
		})
		.fail(function( jqxhr, textStatus, error ) { // TODO
			console.error( "Request Failed: " + error );
		});
	//})
}
$('#themeSelect option[value="' + theme + '"]').attr('selected', 'selected');
$('#themeSelect').on('change', function (){
  	// recreate chart to reset theme
  	theme = this.value;
  	onDataReceive();
	localStorage.setItem('graph-theme', this.value);
});

function transformData(temp_data) {
	var _filtered_data = data.temps.filter(function(t) {return t.cardId === active_module});
	for (var i = 0; i < _filtered_data.length; ++i) {
		_filtered_data[i].created_at = new Date(_filtered_data[i].created_at);
	}
	return _filtered_data;
}

function setModuleSelect() {
	if ($mod_select.val() !== null) return ; // already initialized
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
	$('#anychart').css("width", (window.innerWidth-30) + "px").css('height', (window.innerHeight -300) + "px")
	if (chart != null) chart.dispose();
	// set theme
	anychart.theme(theme);
	anychart.format.inputLocale('fr-fr');
	anychart.format.outputLocale(locale);
	anychart.format.outputDateTimeFormat('dd MMM');


	var date_options = {month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"};

	// create a data set
	var filtered_data = transformData(data.temps);
    // create a table
	var dataTable = anychart.data.table('created_at');
	// add data
	dataTable.addData(filtered_data);
	// map data
    var mapping = dataTable.mapAs({value: "maxtemp", x: "created_at"});
	
	// create a stock chart
	chart = anychart.stock();
	chart.animation(true);
	chart.crosshair(true);
	chart.title("Evolution des températures");

	// create the plot
	var plot = chart.plot(0);
	// set grid settings
	plot.yGrid(true)
        .xGrid(true)
        .xMinorGrid(true)
        .legend().titleFormat(function () {
        	return lang("The") + " " + new Date(this.value).toLocaleDateString(locale, date_options);
		})
		.itemsFormat(function() {
			return series.name() + ": " + this.value + "°C";
		});
	//plot.xAxis().labels().format(function() {return new Date(this.value).toLocaleDateString("fr-FR", date_options)});
    var series = plot.spline(mapping)
            .name(getModuleFromId(active_module).name)
            .stroke(strokeColorsFct);
	series.hovered().markers(true);
	window.series = series;

	function strokeColorsFct() {
	  var v = this.value;
	  var color = '#ee4237';
	  // color the maximal value
	  //if (this.value == this.series.getStat('seriesMax')) return '#94353C';
	  // color elements depending on the argument
	  if  (v < 60) color = '#2fa85a'; // 60
	  else if  ((v >= 60) && (v < 75)) color = '#ecef17'; // 75
	  return {
	  	color: color,
	  	angle: 90,
		//keys: ['#2fa85a', '#ecef17', '#ee4237'],
		thickness: 3
	  };


	  // get the default otherwise
	  // return this.sourceColor;
	}

	// adjust tooltips
	var tooltip = series.tooltip();


    var tooltipchart = chart.tooltip();
	tooltipchart.titleFormat(function () {
		var date = new Date(this.x);
		var transformedDate =  date.toLocaleDateString(locale, date_options);
        return "Le " + transformedDate;
    });

	tooltip.format(function () {
		var value = (this.value).toFixed(0);
		return "Temp: " + value + "°C";
	});

	// set Y axis label formatter
	//chart.yScale().minimum(getMinTempOfDataSet(filtered_data) -5);
	//chart.yScale().maximum(getMaxTempOfDataSet(filtered_data) +5);

	// minimap
	var series_minimap = chart.scroller().spline(mapping);
	series_minimap.tooltip().format(function() {
		return date.toLocaleDateString(locale, date_options);
	});


    // create range picker
    // var rangePicker = anychart.ui.rangePicker();
    // // init range picker
    // rangePicker.render(chart);

    // // create range selector
    // var rangeSelector = anychart.ui.rangeSelector();
    // // init range selector
    // rangeSelector.render(chart);
	// chart.xAxis().labels().format(function () {
	// 	return new Date(this.value).toLocaleDateString("fr-FR", date_options);
	// });
	// chart.yAxis().labels().format(function () {
	// 	return this.value + '°C';
	// });

	// turn on X Scroller
	// chart.xScroller(true);
	// // turn on Y Scroller
	// chart.yScroller(true);

	// // set container and draw chart
	chart.container("anychart");
	chart.draw();
	//startStream(mapping, dataTable, filtered_data);
}
/*
function startStream(mapping, dataTable, filtered_data) {
 	// set interval of data stream
	clearInterval(interval_var);
	console.warn(filtered_data);
	interval_var = setInterval(function() {

      // append data

      anychart.data.set().append({
        cardId: "1850-00099",
		created_at: "Sat, 18 Apr 2020 22:16:10 GMT",
        // random value from 1 to 500
        maxtemp : Math.floor((Math.random() * 40)+ 1)
      });
    }, 2000);
  };

*/
/************************************/

	// set X axis labels formatter
	// create custom Date Time scale
	// var dateTimeScale = anychart.scales.dateTime();
	// var dateTimeTicks = dateTimeScale.ticks();
	// dateTimeTicks.interval(0, 6);
	// // apply Date Time scale
	// chart.xScale(dateTimeScale);




	//minimap
	// access labels

function getModuleFromId(module_id) {
	return data.modules.find(function(o) { return o.module_id == module_id;})
}
/*
function getMaxDateOfDataSet(dataset) {
	return Math.max.apply(Math, dataset.map(function(o) { return o.created_at; }))
}
function getMaxTempOfDataSet(dataset) {
	return Math.max.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
}
function getMinTempOfDataSet(dataset) {
	return Math.min.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
}
*/
return {init: init};
});