define(['moment', 'chart.js', 'moment/locale/fr'], function(moment, chartJS, mlocalefr) {
	moment.locale('fr');
	window.mom = moment;
	function loadGraph(dataSrc) {
		console.log(moment().format('LLLL'));
		console.log('datasrc', dataSrc);
		var datasets = [];
		for (var i = dataSrc.length - 1; i >= 0; i--) {
			if (dataSrc[i].options.includes("maxtemp")) {
				var op = JSON.parse(dataSrc[i].options);
				if (op.maxtemp > -90 && op.maxtemp != 0) {
					var dataset = datasets.find(function(e) {return e.label === dataSrc[i].cardId});
					console.log('dataset', dataset);
					if (!dataset) {
						datasets.push({
							type: 'line',
							data: [{
								x: new moment(dataSrc[i].created_at),
								y: op.maxtemp
							}],
							label: dataSrc[i].cardId,
							fillColor: "rgba(0,0,0,0)",
                    		strokeColor: "rgba(220,220,220,1)",
                    		pointColor: "rgba(200,122,20,1)"
						});
					} else {
						dataset.data.push({
							x: new moment(dataSrc[i].created_at),
							y: op.maxtemp
						});
					}
				}
			}
		}
		console.log('datasets', datasets);

		var minDataValue = Number.POSITIVE_INFINITY;
		var maxDataValue = Number.NEGATIVE_INFINITY;
		var tmp;
		for (var i=datasets.length-1; i>=0; i--) {
		    tmp = Math.max.apply(Math, datasets[i].data.map(function(o) { return o.y; }));
		    if (tmp < minDataValue) minDataValue = tmp;
		    if (tmp > maxDataValue) maxDataValue = tmp;
		}
		    console.log('tmp', minDataValue, maxDataValue);

		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			data: {
				datasets: datasets
			},
			options: {
				scales: {
					xAxes: [{
						type: 'time'
					}],
					yAxes: [{
		                ticks: {
		                	suggestedMin: minDataValue - 5,
                    		suggestedMax: maxDataValue + 5,
		                    // Include a dollar sign in the ticks
		                    callback: function(value, index, values) {
		                        return value + '°C'	;
		                    }
		                }
		            }]
				},
				legend: false
			}
		});
	}
	return {loadGraph: loadGraph};
});