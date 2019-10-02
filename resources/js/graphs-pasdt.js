define(["d3", "jquery"], function(d3, $) {

	function loadGraph(data) {
		var height   = 200;
		var width    = 700;
		var hEach    = 40;
		var margin   = {top: 20, right: 15, bottom: 25, left: 25};
		var lineData = initlineData(data);
		width  = width - margin.left - margin.right;
		height = height - margin.top - margin.bottom;

		svg = initGraph(width, height, margin);

		var xScale = setXRange(svg, lineData, width);
		var yScale = setYRange(svg, lineData, height);

		drawLine(svg, lineData, xScale, yScale);

		//  var xAxis_woy = d3.axisBottom(x).tickFormat(d3.timeFormat("Week %V"));
		var xAxis_woy = d3.axisBottom(xScale).ticks(11).tickFormat(d3.timeFormat("%y-%b-%d")).tickValues(lineData.map(d=>d.date));

		svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis_woy);

		addYAxis(svg, lineData);
		//addDotText(svg, lineData);
		addTitle(svg);
	}

	function drawLine(svg, lineData, xScale, yScale) {
		var valueline = d3.line()
		        .x(function(d) { return xScale(d.date); })
		        .y(function(d) { return yScale(d.nps);  })
		        .curve(d3.curveMonotoneX);

		svg.append("path")
		    .data([lineData]) 
		    .attr("class", "line")  
		    .attr("d", valueline); 
	}

	function setYRange(svg, lineData, height) {
		var y = d3.scaleLinear().range([height, 0]);
		y.domain([d3.min(lineData, function(d) { return d.nps; }) - 5, 100]);
		return y;
	}

	function setXRange(svg, lineData, width) {
		var xScale = d3.scaleTime();
		  
		xScale
			.domain(
			d3.extent(
				lineData,
				function(d) { return d.date; }))
			.range([0, width])
			.nice();
			return xScale;
	}

	function addTitle(svg) {
		svg.append('text')                                     
		   .attr('x', 10)              
		   .attr('y', -5)             
		   .text('Événements');
	}
	function addDotText(svg, lineData) {
		svg.selectAll(".text")
		    .data(lineData)
		    .enter()
		    .append("text") // Uses the enter().append() method
		    .attr("class", "label") // Assign a class for styling
		    .attr("x", function(d, i) { return xScale(d.date) })
		    .attr("y", function(d) { return y(d.nps) })
		    .attr("dy", "-5")
		    .text(function(d) {return d.nps; });
	}

	function addYAxis(svg, lineData) {
		svg.selectAll(".dot")
		    .data(lineData)
		    .enter()
		    .append("circle") // Uses the enter().append() method
		    .attr("class", "dot") // Assign a class for styling
		    .attr("cx", function(d) { return xScale(d.date) })
		    .attr("cy", function(d) { return y(d.nps) })
            .attr('fill-opacity', 0.6)
		    .attr("r", 5);  
	}

	function initGraph(width, height, margin) {

		$('#graphs > svg').remove();
		return d3.select('#graphs').append("svg")
		  .attr("width",  width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	}

	function initlineData(data) {
		var lineData = [];
		/*
		lineData.push({date:new Date(2019, 1, 4), nps:89});
		lineData.push({date:new Date(2019, 1, 11), nps:96});
		lineData.push({date:new Date(2019, 1, 18), nps:87});
		lineData.push({date:new Date(2019, 1, 25), nps:99});
		lineData.push({date:new Date(2019, 2, 4), nps:83});
		lineData.push({date:new Date(2019, 2, 11), nps:93});
		lineData.push({date:new Date(2019, 2, 18), nps:79});
		lineData.push({date:new Date(2019, 2, 25), nps:94});
		lineData.push({date:new Date(2019, 3, 4), nps:89});
		lineData.push({date:new Date(2019, 3, 11), nps:93});
		lineData.push({date:new Date(2019, 3, 18), nps:81});
		*/
		for (var i = data.length - 1; i >= 0; i--) {
			lineData.push({date: new Date(data[i].updated_at), nps: data[i].eventType});
		}


		lineData.sort(function(a,b){
		    return new Date(b.date) - new Date(a.date);
		});
		return lineData;
	}
	return {
		color: "blue",
		size: "large",
		loadGraph: loadGraph
	}
});


/*
const xValue = d => d.timestamp;
      const xLabel = 'Time';
      const yValue = d => d.temperature;
      const yLabel = 'Temperature';
      const margin = { left: 120, right: 30, top: 20, bottom: 120 };

      const svg = d3.select('svg');
      const width = svg.attr('width');
      const height = svg.attr('height');
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
      const xAxisG = g.append('g')
          .attr('transform', `translate(0, ${innerHeight})`);
      const yAxisG = g.append('g');

      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', innerWidth / 2)
          .attr('y', 100)
          .text(xLabel);

      yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', -innerHeight / 2)
          .attr('y', -60)
          .attr('transform', `rotate(-90)`)
          .style('text-anchor', 'middle')
          .text(yLabel);

      const xScale = d3.scaleTime();
      const yScale = d3.scaleLinear();

      const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(15)
        .tickSize(-innerHeight);

      const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
        .tickPadding(15)
        .tickSize(-innerWidth);

      const row = d => {
        d.timestamp = new Date(d.timestamp);
        d.temperature = +d.temperature;
        return d;
      };

      d3.csv('week_temperature_sf.csv', row, data => {
        xScale
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();

        yScale
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();

        g.selectAll('circle').data(data)
          .enter().append('circle')
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('fill-opacity', 0.6)
            .attr('r', 8);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
      });
      */