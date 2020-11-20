(function() {
  return ;
  var d3 = require('d3');
  var today = new Date();
  var yesterday = new Date();
  var oneHourAgo = new Date(today - 3600 * 1000);
  var duration =   1000000;
  var duration_s = 1000;
  yesterday.setDate(today.getDate() - 1);
  var lastmonth = prvDateMonth = new Date(today.getFullYear(),today.getMonth()-1,today.getMonth());






var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  duration = this.value;
  duration_s = this.value;
}

/*
function daysDifference(d0, d1) {
  var diff = new Date(new Date(+d1).setHours(12) - new Date(+d0).setHours(12));
  return diff;
  return Math.round(diff/8.64e7);
}

// Simple formatter
function formatDate(date){

  return [date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2),('0'+date.getDate()).slice(-2), date.getTime()].join('-');
}

    $( "#rangeslider" ).slider({
      range: true,
      min: yesterday.getTime(),
      max: today.getTime(),
      step: 86400,
      values: [ oneHourAgo.getTime(), today.getTime() ],
      slide: function( event, ui ) {
        $( "#slidevalue" ).val( (new Date(ui.values[ 0 ]).toLocaleString('fr-FR') ) + " - " + (new Date(ui.values[ 1 ])).toLocaleString('fr-FR') );
  		duration = (ui.values[1] - ui.values[0]);
  		duration_s = duration / 1000 * 4 ; // ?
  		console.log('duration', new Date(duration).toLocaleString('fr-FR'));
      }
    });*/
  var historyLength  = 243,
    now = new Date(Date.now() - duration_s),
    count = 0,
    scrollData = d3.range(historyLength).map(function() {
      return 0;
    });
  var margin = { top: 6, right: 0, bottom: 20, left: 40 },
    width = 960 - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3
    .scaleTime()
    .domain([now - (historyLength  - 2) * duration_s, now - duration_s])
    .range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var line = d3
    .line()
    .x(function(d, i) {
      return x(now - (historyLength  - 1 - i) * duration_s);
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
    .duration(duration_s)
    .ease(d3.easeLinear);

  d3.select(window).on("scroll", function() {
    ++count;
  });

  (function tick() {

    transition = transition
      .each(function() {
        // update the domains
        now = new Date();
        x.domain([now - (historyLength  - 2) * duration_s, now - duration_s]);
        y.domain([0, d3.max(scrollData)]);
        //console.log('x', new Date(now - (historyLength  - 2) * duration_s), ' to ', new Date(now - duration_s));
        // push the accumulated count onto the back, and reset the count
        scrollData.push(Math.min(30, count));
        count = 0;

        // redraw the line
        svg.select(".line").attr("d", line).attr("transform", null);
        // slide the line left
        path
          .transition(transition)
          .attr("transform", "translate(" + x(now - (historyLength  - 1) * duration_s) + ")");

        // slide the x-axis left
        d3.select(".xaxis").transition(transition).call(d3.axisBottom(x));

        // pop the old data point off the front
        scrollData.shift();
      })
      .transition()
      .on("start", tick);
  })();
})();
