
// declaring constants
var CANVAS_WIDTH = $(window).width() - 500;
var CANVAS_HEIGHT = $(window).height() * 0.8;

var CHART_MARGINS = {
  top: 80,
  bottom: 80,
  left: 80,
  right: 80
};
var CHART_WIDTH = CANVAS_WIDTH - CHART_MARGINS.left - CHART_MARGINS.right;
var CHART_HEIGHT = CANVAS_HEIGHT - CHART_MARGINS.top - CHART_MARGINS.bottom;

var chart_config = {
  "bars": {
    "width": 50, // width of the bar (in px)
    "spacing": 0.3, // amount of spacing between each bar (between 0 and 1)
    "fill": "green",
    "stroke": "#333",
    "y_label": "Drinks Consumed"
  }
};

// this data and the max/min are hardcoded right now, but these eventually need to be dynamic
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

function createChart(container) {
  var xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);

  var yScale = d3.scale.linear().range([CHART_HEIGHT, 0]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      // .tickFormat(d3.time.format("%Y-%m"));
      .ticks(10);

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

  container
    .attr("transform",
          "translate(" + CHART_MARGINS.left + "," + CHART_MARGINS.top + ")");




  // d3.csv("bar-data.csv", function(error, data) {

  //     data.forEach(function(d) {
  //         d.date = parseDate(d.date);
  //         d.value = +d.value;
  //     });

  xScale.domain(chart_data.map(function(d, i) { return i; }));
  yScale.domain([0, d3.max(chart_data, function(d) { return d; })]);

  container.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + CHART_HEIGHT + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      // .attr("dx", "-.8em")
      .attr("dy", "1.3em");
      // .attr("transform", "rotate(-50)" );

  container.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3.5em")
      .attr("dx", "-0.3em")
      .style("text-anchor", "end")
      .text(chart_config["bars"]["y_label"]);

  container.selectAll("bar")
      .data(chart_data)
    .enter().append("rect")
      .style("fill", chart_config["bars"]["fill"])
      .style("stroke", chart_config["bars"]["stroke"])
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d); })
      .attr("height", function(d) { return CHART_HEIGHT - yScale(d); });
}

function updateChartConfigValue(type, key, value) {
  chart_config[type][key] = value;

  if (type == "bars") {
    container.selectAll(".chart_bar").transition().attr(key, value);
  }
}


$(document).ready(function() {
  var container = createSVG();
  // var chart_bars = createChartBars(container);
  createChart(container);
});