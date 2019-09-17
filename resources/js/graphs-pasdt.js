define(["plotly.js-dist"], function(Plotly) {
	var graphDiv, graph, data;

  	function unpack(rows, key) {
	  return rows.map(function(row) { return row[key]; });
	}
   

	function reinitGraph(graphdata) {
		console.log('REINITN', graphdata);
		if (typeof graphDiv === 'undefined') {
			initGraph(graphdata);
		} else {
			console.log('else');
			//adjustValue1(83);
			adjustValues(graphdata);
		}
	}

	function initGraph(graphdata) {
		graphDiv = document.getElementById('tester');

		 var data = [{
			type: 'scatter',
			mode: 'markers',
			x: unpack(graphdata, 'updated_at'),
			y: unpack(graphdata, 'id'),
			text: unpack(graphdata, 'cardId')/*,
			marker: {
				size: unpack(graphdata, 'eventType'),
				sizemode: "area",
				sizeref: 2
			}/*,
			transforms: [{
				type: 'filter',
				target: unpack(graphdata, 'year'),
				operation: '=',
				value: '2007'
			}, {
				type: 'groupby',
				groups: unpack(graphdata, 'cardId'),
				styles: [
				  {target: 'Asia', value: {marker: {color: 'red'}}},
				  {target: 'Europe', value: {marker: {color: 'blue'}}},
				  {target: 'Americas', value: {marker: {color: 'orange'}}},
				  {target: 'Africa', value: {marker: {color: 'green'}}},
				  {target: 'Oceania', value: {marker: {color: 'purple'}}}
				]}
			]*/
    	}];
		Plotly.newPlot(graphDiv, data);
	}


	function adjustValue1(value) {
	    data[0]['y'][0] = value;
	    Plotly.redraw(graphDiv);
	}

	function adjustValues(graphdata) {
		data[0].y = [60];
	    Plotly.redraw(graphDiv);
    	//Plotly.restyle('PlotlyTest', 'y', [[value]]);
	}

    return {
        color: "blue",
        size: "large",
        reinitGraph: reinitGraph
    }
});

