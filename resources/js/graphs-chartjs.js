define(['moment/moment', 'chart.js', 'moment/locale/fr'], function(moment, chartJS, mlocalefr) {
	moment.locale('fr');
	window.mom = moment;
	function loadGraph(dataSrc) {
		var datasets = [];
		for (var i = dataSrc.length - 1; i >= 0; i--) {
			if (dataSrc[i].options != null && dataSrc[i].options.includes("maxtemp")) {
				var op = JSON.parse(dataSrc[i].options);
				if (op.maxtemp > -98 && op.maxtemp < 784) {
					var dataset = datasets.find(function(e) {return e.label === dataSrc[i].cardId});
					if (!dataset) {
						datasets.push({
							type: 'line',
							data: [{
								x: new moment(dataSrc[i].created_at),
								y: op.maxtemp
							}],
							label: dataSrc[i].cardId,
							fillColor: dynamicColors(),
                    		strokeColor: dynamicColors(),
                    		pointColor: dynamicColors()
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
		var minDataValue = Number.POSITIVE_INFINITY;
		var maxDataValue = Number.NEGATIVE_INFINITY;
		var tmp;
		for (var i=datasets.length-1; i>=0; i--) {
		    tmp = Math.max.apply(Math, datasets[i].data.map(function(o) { return o.y; }));
		    if (tmp < minDataValue) minDataValue = tmp;
		    if (tmp > maxDataValue) maxDataValue = tmp;
		}

		var ctx = document.getElementById('myChart');
		var chartInstance = new Chart(ctx, {
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
				}
			}
		});
	}

	function dynamicColors() {
	    var r = Math.floor(Math.random() * 255);
	    var g = Math.floor(Math.random() * 255);
	    var b = Math.floor(Math.random() * 255);
	    console.log("rgba(" + r + "," + g + "," + b + ", 0.5)");
	    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
	}
	return {loadGraph: loadGraph};
});