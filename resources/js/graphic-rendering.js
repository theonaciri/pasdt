define(["jquery", 'moment', "./components/lang", "./dependencies/curve" /*, "anychart", "anychart-jquery"*/],
	function ($, moment, lang, curve) {
		window.chart = null;
		var $mod_select = $('#graphModuleSelect');
		var data = null;
		var theme = localStorage.getItem('graph-theme') || "darkBlue";
		var active_module = localStorage.getItem('graph-active-module');
		var interval_var = null;
		const fromDate = new Date("2018-04-25 13:40:24");
debugger
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

			$.getJSON("/logs/temp", { from: fromDate.toJSON(), modules: active_module })
				.done(function (_data) {
					data = _data;
					$(document).ready(onDataReceive());
				})
				.fail(function (jqxhr, textStatus, error) { // TODO
					console.error("Request Failed: " + error);
				});
		}

		function getLastNDatas(currentIndex, n, data) {
			let lastNData = [];
			let limit = (currentIndex - n >= 0) ? currentIndex - n : -1;

			for (let i = currentIndex; i > limit; i--) {
				lastNData.unshift(data[i]);
			}
			return lastNData;
		}

		function getAverage(data) {
			let sum = 0;
			for (let i = 0, len = data.length; i < len; i++) {
				sum += data[i].maxtemp;
			}
			average = (Math.round((sum / data.length) * 100) / 100); // à proteger avec un try - catch
			return average;
		}

		// function getAverageCurve(data) {
		// 	let dataWithAverage = [];
		// 	let average = 0;
		// 	const nbOfPoints = 70;
		// 	data.forEach((item, index) => {
		// 		average = getAverage(getLastNDatas(index, nbOfPoints, data));
		// 		dataWithAverage.push({
		// 			created_at: item.created_at,
		// 			maxtemp: item.maxtemp,
		// 			average: average,
		// 		});
		// 	});
		// 	return dataWithAverage;
		// };

		// function getRegressiveCurve(data) {
		// 	const projectedOnDays = 3;
		// 	const coeff = regLin(data.map(({ maxtemp }) => maxtemp));
		// 	const timeCoeff = getUnitOfTime(data, projectedOnDays);

		// 	let tabResult = [];

		// 	for (let index = 0; index < data.length; index++) {
		// 		tabResult.push({
		// 			created_at: data[index].created_at,
		// 			maxtemp: data[index].maxtemp,
		// 			average: (Math.round((coeff.a * index + coeff.b) * 100) / 100)
		// 		})
		// 	}

		// 	let estimated_data = [];
		// 	for (let i = 0; i < timeCoeff.nb; i++) {

		// 		const tempMax = 250;
		// 		const tempMin = -50;
		// 		let calculatedTemps = (Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100) > tempMax ?
		// 			tempMax : ((Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100) < tempMin) ?
		// 				tempMin : (Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100);

		// 		let dateTime = new Date();
		// 		const last_date = new Date(data[data.length - 1].created_at);
		// 		dateTime.setTime(last_date.getTime() + (i + 1) * timeCoeff.ut)
		// 		let transformedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

		// 		estimated_data.push({
		// 			//average: calculatedTemps,
		// 			average: calculatedTemps,
		// 			created_at: transformedDate
		// 		})
		// 	}

		// 	tabResult = tabResult.concat(estimated_data);
		// 	return tabResult;
		// }

		// function getUnitOfTime(data, days) {
		// 	let first_date = new Date(data[0].created_at);
		// 	let last_date = new Date(data[data.length - 1].created_at);
		// 	// let start_date, end_date = new Date();

		// 	let unit_of_time = 0;

		// 	if (first_date > last_date) {//(first_date.getTime() > last_date.getTime()) {
		// 		unit_of_time = Math.round((first_date.getTime() - last_date.getTime()) / data.length);
		// 		// start_date = last_date;
		// 		// end_date = first_date;
		// 	} else {
		// 		unit_of_time = Math.round((last_date.getTime() - first_date.getTime()) / data.length);
		// 		// start_date = first_date;
		// 		// end_date = last_date;
		// 	}

		// 	//milliseconds * second * minutes * hours * days (projected on "x" days)
		// 	let nb_val_calculated = (Math.round(1000 * 60 * 60 * 24 * days / unit_of_time)) < 500 ?
		// 		(Math.round(1000 * 60 * 60 * 24 * days / unit_of_time)) : 500;

		// 	return { nb: nb_val_calculated, ut: unit_of_time }; //end_date;
		// }

		// function regLin(points_y) {
		// 	// Ajuste une droite d'équation a*x + b sur les points (x, y) par la méthode
		// 	// des moindres carrés.

		// 	// 		Args :
		// 	// * x(list): valeurs de x
		// 	// 		* y(list): valeurs de y
		// 	// 	Return:
		// 	// * a(float): pente de la droite
		// 	// 		* b(float): ordonnée à l'origine

		// 	// # initialisation des sommes
		// 	let x_sum = 0;
		// 	let x2_sum = 0;
		// 	let y_sum = 0;
		// 	let xy_sum = 0;
		// 	try {
		// 		// # calcul des sommes
		// 		for (let index = 0; index < points_y.length; index++) {
		// 			x_sum += index;
		// 			x2_sum += index ** 2;
		// 			y_sum += points_y[index];
		// 			xy_sum += index * points_y[index];
		// 		}
		// 		// # nombre de points
		// 		npoints = points_y.length;
		// 		// # calcul des paramétras
		// 		const a = (npoints * xy_sum - x_sum * y_sum) / (npoints * x2_sum - x_sum ** 2);
		// 		const b = (x2_sum * y_sum - x_sum * xy_sum) / (npoints * x2_sum - x_sum ** 2);
		// 		// # renvoie des parametres
		// 		return { a: a, b: b };
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// }

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

			// get regressive curve
			const tempsWithAverage = curve(data.temps);
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
				const d = new Date(this.x);
				const last_date = new Date(data.temps[data.temps.length - 1].created_at);
				let color = 'DodgerBlue';
				let dash = 'solid';
				if (d > last_date) {
					color = 'cyan';
					dash = '5 5';
				}
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
				var value = (this.value).toFixed(0);
				return "Temp: " + value + "°C";
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
			const now = moment().format("YYYY-MM-DD");
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

		/*	function getProjectedCurve(data) {
	
				// try {
				const nb_of_points = 3;
				let last_data = getLastNDatas(data.length - 1, nb_of_points, data);
	
					
				//LAGRANGE
				let lagrange_table = [];
				for (let i = 0; i < last_data.length; i++) {
					lagrange_table.push({
						x: i,
						y: last_data[i].average
					})
				}
	
				let l = new Lagrange(lagrange_table.map(({ x }) => x), lagrange_table.map(({ y }) => y));
				let estimated_data = [];
				// let estimated_data = [{
				// 	projectedAverage: data[data.length - 1].average,
				// 	created_at: data[data.length - 1].created_at
				// }];
				for (let i = nb_of_points; i < nb_val_calculated + nb_of_points; i++) {
	
					const tempMax = 250;
					const tempMin = -50;
					let calculatedTemps = (Math.round(l.valueOf(i) * 100 / 100)) > tempMax ?
						tempMax : (Math.round(l.valueOf(i) * 100 / 100) < tempMin) ?
							tempMin : Math.round(l.valueOf(i) * 100 / 100);
	
					let dateTime = new Date();
					dateTime.setTime(start_date.getTime() + (i) * unit_of_time)
					let transformedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");//.toLocaleDateString(locale, date_options);
	
					estimated_data.push({
						average: calculatedTemps,
						//projectedAverage: calculatedTemps,
						created_at: transformedDate
					})
				}
	
				return estimated_data;
			}*/

		return { init: init };
	});