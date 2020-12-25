define(["jquery", 'moment', "./components/getURLParameter", "./components/autorefreshapi",
		"./components/lang", "./dependencies/regressive-curve", "./components/strcap"
		/* anychart is added dynamically "anychart", "anychart-jquery"*/],
function ($, moment, getURLParameter, autoReload, lang, regressiveCurve) {
	window.chart = null;
	var $mod_select = $('#graphModuleSelect');
	var data = null;
	var theme = localStorage.getItem('graph-theme') || "darkBlue";
	var active_module_id;
	var interval_var = null;
	var temp_high = 80;
	var temp_xhigh = 90;
	const days_before = 30;
	const days_after = 30;
	var t = new URLSearchParams(location.search);

	function init() {
		if (chart != null) return; // only one init;
		setModuleSelect();
		autoReload.init({
			name: "temps",
			cb: function() {
				getTemps();
			}
		});
		getLocalTemps();
	}
	$('#themeSelect option[value="' + theme + '"]').attr('selected', 'selected');
	$('#themeSelect').on('change', function (e) {
		// recreate chart to reset theme
		theme = this.value;
		onDataReceive();
		localStorage.setItem('graph-theme', this.value);
	});

	function getLocalTemps() {
		var cached_temps = JSON.parse(sessionStorage.getItem("temps") || "{}");
		setModalTempThresholds();
		if (cached_temps.hasOwnProperty(active_module_id)) {
			data = cached_temps[active_module_id];
			onDataReceive(true);
		} else {
			getTemps();
		}
	}
	function getTemps() {
		//const fromDate = new Date("2018-04-15");
		$.getJSON("/logs/temp/" + active_module_id/*, { from: fromDate.toJSON(), modules: active_module }*/)
		.done(function (_data, a, e) {
			data = _data.temps;
			onDataReceive();
			var _date = e.getResponseHeader('date');
      		var received_date = moment(_date.slice(_date.lastIndexOf(',') + 1));
		    var cached_temps = JSON.parse(sessionStorage.getItem("temps") || "{}");
		    cached_temps[active_module_id] = data;
		    sessionStorage.setItem("temps", JSON.stringify(cached_temps));
		    sessionStorage.setItem("temps_time", received_date.toJSON());
		})
		.fail(function (jqxhr, textStatus, error) { // TODO
			console.error("Request Failed: " + error);
		});
	}

	function setModuleSelect() {
		active_module_id = +$mod_select.val();
		$mod_select.on('change', function () {
			active_module_id = +$mod_select.val();
			getTemps();
		})
	}

	function setModalTempThresholds() {
		var $modmodalbody = $("#moduleGraphColorModal .modal-body");
		var mod = presynths.find(p => p.id === active_module_id); 
		var json = JSON.parse(typeof mod.thresholds === "string" && mod.thresholds.length ? mod.thresholds : "{}");
		temp_high = json.TEMP_HIGH ? json.TEMP_HIGH : $modmodalbody.data("high");
		temp_xhigh = json.TEMP_CRIT_HIGH ? json.TEMP_CRIT_HIGH : $modmodalbody.data("xhigh");
		$modmodalbody.find('.temp_high').html(temp_high);
		$modmodalbody.find('.temp_xhigh').html(temp_xhigh);
	}

	function onDataReceive(cached = false) {
		$('#anychart').css("width", (window.innerWidth - 30) + "px").css('height', (window.innerHeight - 300) + "px")
		if (chart != null) chart.dispose();
		// set theme
		anychart.theme(theme);
		anychart.format.inputLocale('fr-fr');
		anychart.format.outputLocale(locale);
		anychart.format.outputDateTimeFormat('dd MMM');

		var date_options = { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };

		// create a table
		var dataTable = anychart.data.table('d');

		// get regressiveCurve
		data = cached ?
			data : regressiveCurve(data, days_before, days_after);

		// add data
		dataTable.addData(data);

		// map data
		var mapping = dataTable.mapAs({ value: "t", x: "d" });

		// create a stock chart
		chart = anychart.stock();
		chart.animation(true);
		chart.crosshair(true);
		chart.title(lang("Evolution of temperatures"));

		// create the plot
		var plot = chart.plot(0);
		// set grid settings
		plot.yGrid(true)
			.xGrid(true)
			.xMinorGrid(true)
			.legend().titleFormat(function () {
				return lang("The") + " " + new Date(this.value || this.hoveredDate).toLocaleDateString(locale, date_options);
			})
			.itemsFormat(function () {
				return this.seriesName + ": " + (this.value ? this.value : "--") + "°C";
			});
		//plot.xAxis().labels().format(function() {return new Date(this.value).toLocaleDateString("fr-FR", date_options)});

		var average = plot.spline(
			dataTable.mapAs({
				value: "a",
				x : "d"
			})
		).name(lang("Average")).stroke(colorForAverage);

		var series = plot.spline(mapping)
			.name(getModuleFromId(active_module_id).name)
			.stroke(strokeColorsFct);
		series.hovered().markers(true);

		// adjust tooltips
		var tooltip = series.tooltip();


		var tooltipchart = chart.tooltip();
		tooltipchart.titleFormat(function () {
			var date = new Date(this.x || this.hoveredDate || this.rawHoveredDate);
			var transformedDate = date.toLocaleDateString(locale, date_options);
			return lang("The") + " " + transformedDate;
		});

		tooltip.format(function () {
			if (this.value) {
				var value = (this.value).toFixed(0);
				return lang("temperature").capitalize() + ": " + value + "°C";
			}
		});

		// set Y axis label formatter
		//chart.yScale().minimum(getMinTempOfDataSet(filtered_data) -5);
		//chart.yScale().maximum(getMaxTempOfDataSet(filtered_data) +5);

		// minimap
		var series_minimap = chart.scroller().spline(mapping);
		series_minimap.tooltip().format(function () {
			return date.toLocaleDateString(locale, date_options);
		});

		//Preset zoom option
		const last_date = moment(data[data.length-1].d).format("YYYY-MM-DD");
		const start_date = moment(last_date).subtract(days_before + days_after, "days").format("YYYY-MM-DD");
		const end_date = moment(last_date).add(days_after, 'days').format("YYYY-MM-DD");
		chart.selectRange(start_date, end_date);

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

	function colorForAverage() {
		let color = 'DodgerBlue';
		let dash = 'solid';

		if (this.x){
			color = 'cyan';
			if (this.value >= temp_high && this.value < temp_xhigh) color = '#ecef17';
			else if (this.value > temp_xhigh) color = '#ee4237';
			const d = new Date(this.x);
			const last_date = new Date(data[data.length - 1].d);
			// change the line style for estimated datas
			if (d > last_date) {
				color = color;
				dash = '5 5';
			}
		}
		return {
			color: color,
			dash: dash
		}
	}

	function strokeColorsFct() {
		var v = this.value;
		var color = '#2fa85a';
		// color the maximal value
		//if (this.value == this.series.getStat('seriesMax')) return '#94353C';
		// color elements depending on the argument
		if (v >= temp_xhigh) color = '#ee4237'; // 75
		else if ((v >= temp_high) && (v < temp_xhigh)) color = '#ecef17'; // 75
		return {
			color: color,
			angle: 90,
			//keys: ['#2fa85a', '#ecef17', '#ee4237'],
			thickness: 3
		};
		// get the default otherwise
		// return this.sourceColor;
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
			d: "Sat, 18 Apr 2020 22:16:10 GMT",
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
		return presynths.find(function (o) { return o.id == module_id; })
	}
	/*
	function getMaxDateOfDataSet(dataset) {
		return Math.max.apply(Math, dataset.map(function(o) { return o.date; }))
	}
	function getMaxTempOfDataSet(dataset) {
		return Math.max.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
	}
	function getMinTempOfDataSet(dataset) {
		return Math.min.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
	}
	*/

	return { init: init };
});