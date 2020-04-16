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

	function randomScalingFactor() {
		return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	}

	function onReceive(event) {
		window.myChart.config.data.datasets[event.index].data.push({
			x: event.timestamp,
			y: event.value
		});
		window.myChart.update({
			preservation: true
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

		document.getElementById('addDataset').addEventListener('click', function() {
			var colorName = colorNames[config.data.datasets.length % colorNames.length];
			var newColor = chartColors[colorName];
			var newDataset = {
				label: 'Dataset ' + (config.data.datasets.length + 1),
				backgroundColor: color(newColor).alpha(0.5).rgbString(),
				borderColor: newColor,
				fill: false,
				lineTension: 0,
				data: []
			};

			config.data.datasets.push(newDataset);
			window.myChart.update();
			startFeed(config.data.datasets.length - 1);
		});

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

		++nb_init;
	}

	function init() {
		if (!nb_init) {
			first_init();
		} else {
			chart_elem.remove();
			chart_elem = document.createElement("canvas");
			chart_elem.id = "liveChart";
			parent.appendChild(chart_elem);
		}
		
		config = {
			type: 'line',
			data: {
				datasets: [{
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
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Push data feed sample'
				},
				scales: {
					xAxes: [{
						type: 'realtime',
						realtime: {
							duration: 1*10*60*1000,
							delay: 2000,
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'value'
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
		startFeed(0);
		startFeed(1);
		console.log('loaded');
	}
	return {init: init};
});