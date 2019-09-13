(function() {
  var d3 = require('d3');
  var slider = require('bootstrap-slider');

  var duration = 1000;
	var mySlider = $("#rangeslider").bootstrapSlider().on('change', function() {

	duration = mySlider.bootstrapSlider('getValue');
	});
  var n = 243,
    now = new Date(Date.now() - duration),
    count = 0,
    scrollData = d3.range(n).map(function() {
      return 0;
    });

  var margin = { top: 6, right: 0, bottom: 20, left: 40 },
    width = 960 - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3
    .scaleTime()
    .domain([now - (n - 2) * duration, now - duration])
    .range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var line = d3
    .line()
    .x(function(d, i) {
      return x(now - (n - 1 - i) * duration);
    })
    .y(function(d, i) {
      return y(d);
    })
    .curve(d3.curveBasis);

  var svg = d3
    .select(".graph")
    .append("p")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var xAxis = d3.axisBottom(x);

  var axis = svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis); 

  var path = svg
    .append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(scrollData)
    .attr("class", "line");

  var transition = d3
    .transition() 
    .duration(duration)
    .ease(d3.easeLinear);

  d3.select(window).on("scroll", function() {
    ++count;
  });

  (function tick() {
    transition = transition
      .each(function() {
        // update the domains
        now = new Date();
        x.domain([now - (n - 2) * duration, now - duration]);
        y.domain([0, d3.max(scrollData)]);

        // push the accumulated count onto the back, and reset the count
        scrollData.push(Math.min(30, count));
        console.log('count', Math.min(30, count));
        count = 0;

        // redraw the line
        svg.select(".line").attr("d", line).attr("transform", null);
        // slide the line left
        path
          .transition(transition)
          .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

        // slide the x-axis left
        d3.select(".xaxis").transition(transition).call(d3.axisBottom(x));

        // pop the old data point off the front
        scrollData.shift();
      })
      .transition()
      .on("start", tick);
  })();
})();
