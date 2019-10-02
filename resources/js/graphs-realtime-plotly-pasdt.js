define(['plotly.js-dist'], function(Plotly) {
function rand() {
  return Math.random();
}

var time = new Date();

var trace1 = {
  x: [],
  y: [],
  mode: 'lines',
  line: {
    color: '#80CAF6',
    shape: 'spline'
  }
}

var trace2 = {
  x: [],
  y: [],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: {color: '#DF56F1'}
};

var layout = {
  xaxis: {
    type: 'date',
    domain: [0, 1],
    showticklabels: false
  },
  yaxis: {domain: [0.6,1]},
  xaxis2: {
    type: 'date',
    anchor: 'y2',
    domain: [0, 1]
  },
  yaxis2: {
    anchor: 'x2',
    domain: [0, 0.4]},
}

var data = [trace1,trace2];

Plotly.plot('graphlive', data, layout);

var cnt = 0;

var interval = setInterval(function() {

  var time = new Date();

  var olderTime = time.setMinutes(time.getMinutes() - 1);
  var futureTime = time.setMinutes(time.getMinutes() + 1);

  var update = {
    x: [[olderTime], [futureTime]],
    y: [[rand()], [rand()]]
  }

  Plotly.extendTraces('graphlive', update, [0,1]);
}, 1000);
});