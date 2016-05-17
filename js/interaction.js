
// declaring constants
var CANVAS_WIDTH = $(window).width() - 300;
var CANVAS_HEIGHT = $(window).height() * 0.8;

var CHART_HEIGHT = CANVAS_HEIGHT * 0.7;

var chart_config = {
  "bars": {
    "width": 50, // width of the bar (in px)
    "spacing": 30, // amount of spacing between each bar (in px)
    "fill": "green",
    "stroke": "#333"
  }
};

var chart_data = [40, 60, 25, 70, 66];
var chart_max_value = 80;
var chart_min_value = 0;


function createSVG() {
  // Add an svg element to the DOM
  var svg = d3.select(".vis_container").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

  // create a container for all of our elements
  var container = svg.append("g");
  window.container = container;

  return container;
}

function createChartBars(container) {
  var bars = container.selectAll(".chart_bar")
    .data(chart_data);

  bars.enter()
    .append("rect")
    .attr("class", "chart_bar")
    .attr("width", chart_config["bars"]["width"])
    .attr("height", function(d, i) {
      var bar_height = (d/(chart_max_value*1.0)) * CHART_HEIGHT;
      return bar_height;
    })
    .attr("x", function(d, i) {
      return i * (chart_config["bars"]["width"] + chart_config["bars"]["spacing"]);
    })
    .attr("y", function(d, i) {
      var bar_height = (d/(chart_max_value*1.0)) * CHART_HEIGHT; // same as calculation above for height
      return CHART_HEIGHT - bar_height;
    })
    .attr("fill", chart_config["bars"]["fill"])
    .attr("stroke", chart_config["bars"]["stroke"]);

  return bars;
}

function updateChartConfigValue(type, key, value) {
  chart_config[type][key] = value;

  if (type == "bars") {
    container.selectAll(".chart_bar").transition().attr(key, value);
  }
}


$(document).ready(function() {
  var container = createSVG();
  var chart_bars = createChartBars(container);
});