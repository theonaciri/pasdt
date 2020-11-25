define(["jquery", 'moment', "./components/lang", "./dependencies/regressive-curve" /*, "anychart", "anychart-jquery"*/],
	function ($, moment, lang, regressiveCurve) {
		window.chart = null;
		var $mod_select = $('#graphModuleSelect');
		var data = null;
		var theme = localStorage.getItem('graph-theme') || "darkBlue";
		var active_module = localStorage.getItem('graph-active-module');
		var interval_var = null;
		const days_estimated = 3;
		
		function init() {
			if (chart != null) return; // only one init;

			setModuleSelect();
			getTemps();
			// let estimated = getProjectedCurve(data);

			//})
		}
		$('#themeSelect option[value="' + theme + '"]').attr('selected', 'selected');
		$('#themeSelect').on('change', function () {
			// recreate chart to reset theme
			theme = this.value;
			onDataReceive();
			localStorage.setItem('graph-theme', this.value);
		});

		function getTemps() {
			const fromDate = new Date("2018-04-25 13:40:24");

			$.getJSON("/logs/temp", { from: fromDate.toJSON(), modules: active_module })
				.done(function (_data) {
					data = _data;
					$(document).ready(onDataReceive());
				})
				.fail(function (jqxhr, textStatus, error) { // TODO
					console.error("Request Failed: " + error);
				});
		}

		function setModuleSelect() {
			if ($mod_select.val() !== null) return; // already initialized
			var first_selected = false;

			//disable empty module (in select list)
			presynths.forEach(element => {
				$mod_select.append('<option value="' + element.module_id + '"'
					+ (!element.temp_created_at ?
						' disabled' :
						(!first_selected ? ' selected' : '')
					)
					+ '>'
					+ element.module_id + ' - ' + element.name + "</option>");
				first_selected = true;
			});

			//enabled first (in select list)
			$mod_select.children('option:disabled').each((index, item) => {
				$(item).appendTo($mod_select);
			});

			active_module = $mod_select.children('option:not([disabled]):first').val();
			$mod_select.on('change', function () {
				active_module = $mod_select.val();
				localStorage.setItem('graph-active-module', active_module);
				getTemps();
				onDataReceive();
			})
		}

		function onDataReceive() {
			$('#anychart').css("width", (window.innerWidth - 30) + "px").css('height', (window.innerHeight - 300) + "px")
			if (chart != null) chart.dispose();
			// set theme
			anychart.theme(theme);
			anychart.format.inputLocale('fr-fr');
			anychart.format.outputLocale(locale);
			anychart.format.outputDateTimeFormat('dd MMM');

			var date_options = { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };

			// create a table
			var dataTable = anychart.data.table('created_at');

			// get regressiveCurve
			const tempsWithAverage = regressiveCurve(data.temps, days_estimated);

			// add data
			dataTable.addData(tempsWithAverage);

			// map data
			var mapping = dataTable.mapAs({ value: "maxtemp", x: "created_at" });

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
				.itemsFormat(function () {
					if (this.seriesName !== "Provisional")
						return this.seriesName + ": " + this.value + "°C";
				});
			//plot.xAxis().labels().format(function() {return new Date(this.value).toLocaleDateString("fr-FR", date_options)});

			var average = plot.spline(
				dataTable.mapAs({
					value: "average",
					x : "created_at"
				})
			).name("Average").stroke(colorForAverage);

			var series = plot.spline(mapping)
				.name(getModuleFromId(active_module).name)
				.stroke(strokeColorsFct);
			series.hovered().markers(true);

			// WHYYYYYYY ???
			//window.series = series;

			function colorForAverage() {
				let color = 'DodgerBlue';
				let dash = 'solid';
				if(this.x){
				const d = new Date(this.x);
				const last_date = new Date(data.temps[data.temps.length - 1].created_at);
				// change the line style for estimated datas
				if (d > last_date) {
					color = 'cyan';
					dash = '5 5';
				}}
				return {
					color: color,
					dash: dash
				}
			}

			function strokeColorsFct() {
				var v = this.value;
				var color = '#ee4237';
				// color the maximal value
				//if (this.value == this.series.getStat('seriesMax')) return '#94353C';
				// color elements depending on the argument
				if (v < 60) color = '#2fa85a'; // 60
				else if ((v >= 60) && (v < 75)) color = '#ecef17'; // 75
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
				var transformedDate = date.toLocaleDateString(locale, date_options);
				return "Le " + transformedDate;
			});

			tooltip.format(function () {
				if (this.value){
				var value = (this.value).toFixed(0);
				return "Temp: " + value + "°C";}
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
			const startdate = moment().subtract(1, "month").format("YYYY-MM-DD");
			const now = moment().add(days_estimated, 'days').format("YYYY-MM-DD");
			const last_date = moment(data.temps[data.temps.length-1].created_at).format("YYYY-MM-DD");
			if(startdate < last_date)
				chart.selectRange(startdate, now);

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
			return data.modules.find(function (o) { return o.module_id == module_id; })
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

		return { init: init };
	});