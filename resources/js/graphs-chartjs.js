define(['moment', 'chart.js', 'moment/locale/fr'], function(moment, chartJS, mlocalefr) {
	moment.locale('fr');
	window.mom = moment;
	function loadGraph(dataSrc) {
		console.log(moment().format('LLLL'));
		console.log('datasrc', dataSrc);
		var datasets = [];
		var data = [];
		for (var i = dataSrc.length - 1; i >= 0; i--) {
			if (dataSrc[i].options.includes("maxtemp")) {
				var op = JSON.parse(dataSrc[i].options);
				if (op.maxtemp > -90 && op.maxtemp != 0) {
					if (!Array.isArray(datasets[dataSrc[i].cardId])) {
						console.log('creating', dataSrc[i].cardId);
						datasets[dataSrc[i].cardId] = new Array();
					}
					console.log('aa', datasets[dataSrc[i].cardId]);
					datasets[dataSrc[i].cardId].push({x: new moment(dataSrc[i].created_at), y: op.maxtemp});
				}
			}
		}
		console.log('datasets', datasets);

		var minDataValue = Number.POSITIVE_INFINITY;
		var maxDataValue = Number.NEGATIVE_INFINITY;
		var tmp;
		for (var i=data.length-1; i>=0; i--) {
		    tmp = data[i].y;
		    if (tmp < minDataValue) minDataValue = tmp;
		    if (tmp > maxDataValue) maxDataValue = tmp;
		}

		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [{
					data: data,
					borderColor: "#3e95cd",
					fill: false
				}]
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