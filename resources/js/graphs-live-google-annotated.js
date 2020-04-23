define(["jquery", "moment/moment", "chart.js", "chartjs-plugin-streaming"], function($) {
	var chart_elem = document.getElementById('liveChart');
	var parent = document.getElementById('parentCanvas');
	var timeoutIDs = [];
	var nb_init = 0;
	var config = {};
	var chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};
	var color = Chart.helpers.color;
	var colorNames = Object.keys(chartColors);
	var interval;

	var last_date = new Date();
	last_date.setDate(last_date.getDate() - 2);

	function randomScalingFactor() {
		return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	}

	function onReceive(event) {
		window.myChart.config.data.datasets[event.index].data.push({
			x: event.timestamp,
			y: event.value
		});
		window.myChart.update({
			preservation: !!event.preservation
		});
	}

	function startFeed(index) {
		var receive = function() {
			onReceive({
				index: index,
				timestamp: Date.now(),
				value: randomScalingFactor()
			});
			timeoutIDs[index] = setTimeout(receive, Math.random() * 1000 + 500);
		}
		timeoutIDs[index] = setTimeout(receive, Math.random() * 1000 + 500);
	}

	function stopFeed(index) {
		clearTimeout(timeoutIDs[index]);
	}

	function addData(dataset, module, data) {
		for (var i = 0; i < data.length; ++i) {
			dataset.data.push({
				x: data[i].x,
				y: data[i].y
			});
		}
		window.myChart.update();
	}

	function addDataSet(dataset, temps) {
		var colorName = colorNames[config.data.datasets.length % colorNames.length];
		var newColor = chartColors[colorName];
		var newDataset = {
			label: (dataset.name ? dataset.name : config.data.datasets.length + 1),
			backgroundColor: color(newColor).alpha(0.5).rgbString(),
			borderColor: newColor,
			fill: false,
			lineTension: 0,
			data: Array.isArray(temps) ? temps : []
		};

		config.data.datasets.push(newDataset);
		window.myChart.update();
		//startFeed(config.data.datasets.length - 1);
	}

	function first_init() {
		console.log('in init');
		document.getElementById('randomizeData').addEventListener('click', function() {
			config.data.datasets.forEach(function(dataset) {
				dataset.data.forEach(function(dataObj) {
					dataObj.y = randomScalingFactor();
				});
			});
			window.myChart.update();
		});

		document.getElementById('addDataset').addEventListener('click', addDataSet);

		document.getElementById('removeDataset').addEventListener('click', function() {
			stopFeed(config.data.datasets.length - 1);
			config.data.datasets.pop();
			window.myChart.update();
		});

		document.getElementById('addData').addEventListener('click', function() {
			config.data.datasets.forEach(function(dataset) {
				dataset.data.push({
					x: Date.now(),
					y: randomScalingFactor()
				});
			});
			window.myChart.update();
		});
	}

	function onDataReceive(data, shouldAddDataSet = false) {
		for (var i = 0; i < data.modules.length; ++i) {
			var temps = data.temps.filter(d => d.cardId === data.modules[i].module_id);
			var vals = [];
			for (var j = 0; j < temps.length; ++j) {
				vals.push({
					x: new Date(temps[j].created_at),
					y: temps[j].maxtemp
				});
			}
			if (shouldAddDataSet) {
				addDataSet(data.modules[i], vals);
			} else {
				addData(config.data.datasets[i], data.modules[i], vals);
			}
		}
		if (data.temps.length) {
			last_date = new Date(data.temps[data.temps.length -1].created_at);
		}
	}

	function auto_update() {
		interval = setInterval(function() {
			$.getJSON("/logs/temp", {from: last_date.toJSON()})
			.done(function(data) {
				onDataReceive(data);
			})
			.fail(function( jqxhr, textStatus, error ) {
				console.error( "Request Failed: " + error );
			});
		}, 10 * 1000)
	}

	function setFirstData(data) {
		console.log("data", data);
		$.getJSON("/logs/temp")
		.done(function(data) {
			onDataReceive(data, true);
			auto_update();
		})
		.fail(function( jqxhr, textStatus, error ) {
			console.error( "Request Failed: " + error );
		});
	}

	function init(data) {
		if (!nb_init) {
			first_init();
		} else {
  			clearInterval(interval);
			chart_elem.remove();
			chart_elem = document.createElement("canvas");
			chart_elem.id = "liveChart";
			parent.appendChild(chart_elem);
		}
		
		config = {
			type: 'line',
			data: {
				datasets: [/*{
					label: 'Dataset 1 (linear interpolation)',
					backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
					borderColor: chartColors.red,
					fill: false,
					lineTension: 0,
					borderDash: [8, 4],
					data: []
				}, {
					label: 'Dataset 2 (cubic interpolation)',
					backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
					borderColor: chartColors.blue,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}*/]
			},
			options: {
				title: {
					display: true,
					text: 'Les données sont actualisées toutes les minutes'
				},
				scales: {
					xAxes: [{
						type: 'realtime',
						realtime: {
							duration: 4* 24 * 60 * 60 * 1000,
							delay: 2000,
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: '°C'
						}
					}]
				},
				tooltips: {
					mode: 'nearest',
					intersect: false
				},
				hover: {
					mode: 'nearest',
					intersect: false
				}
			}
		};
		var ctx = chart_elem.getContext('2d');
		ctx.clearRect(0, 0, chart_elem.width, chart_elem.height);
		window.myChart = new Chart(ctx, config);
		//startFeed(0);
		//startFeed(1);
		console.log('loaded');

		setFirstData(data);
		++nb_init;
	}

	if (localStorage.getItem('opened-tab') === 'graphs-live-tab') {
		init();
	}
	return {init: init};
});