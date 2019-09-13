var d3 = require('d3-3');

d3.csv('/json/exampledata.csv', function (data) {
  // Variables
  var body = d3.select('#graphs')
	var margin = { top: 50, right: 50, bottom: 50, left: 50 }
	var h = 600 - margin.top - margin.bottom
	var w = 1000 - margin.left - margin.right
	var formatPercent = d3.format('.2%')
	// Scales
  var colorScale = d3.scale.category20()
  var parseDate = d3.time.format("%Y-%m-%d %X");
  var x = d3.time.scale()
    .range([0, w]);
var y = d3.scale.linear()
    .range([h, 0]);
  var xScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.gravite })]),
    	d3.max([0,d3.max(data,function (d) { return d.gravite })])
    	])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.date })]),
    	d3.max([0,d3.max(data,function (d) { return d.date })])
    	])
    .range([h,0])
	// SVG
	var svg = body.append('svg')
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	  .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
	// X-axis
	var xAxis = d3.svg.axis()
	  .scale(x)
	  //.tickFormat(formatPercent)
	  .ticks(5)
	  .orient('bottom')
  // Y-axis
	var yAxis = d3.svg.axis()
	  .scale(y)
	  //.tickFormat(formatPercent)
	  .ticks(5)
	  .orient('left')
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { console.log(parseDate.parse(d.date)); return x(parseDate.parse(d.date)) })
      .attr('cy',function (d) { return yScale(d.gravite) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.msg +
                           '\nDate: ' + d.date +
                           '\nGravité: ' + d.gravite });

	// array of the regions, used for the legend
	var regions = ["defaut temperature", "defaut gaz", "alarme + defaut temperature"]


  	// the legend color guide
	var legend = svg.selectAll("rect")
		.data(regions)
		.enter().append("rect")
		.attr({
		  x: function(d, i) { return (40 + i*200); },
		  y: h + 24,
		  width: 25,
		  height: 12
		})
		.style("fill", function(d) { return colorScale(d); });

	// legend labels	
		svg.selectAll("text")
			.data(regions)
		.enter().append("text")
		.attr({
		x: function(d, i) { return (40 + i*200); },
		y: h + 24 + 24,
		})
		.text(function(d) { return d; });



  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Temps')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text("Gravité de l'événement")
})