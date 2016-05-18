
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
    "spacing": 0.3, // amount of spacing between each bar (between 0 and 1)
    "fill": "green",
    "stroke": "#333",
    "label_visible": false,
    "label_color": "blue",
    "label_font_size": 14
    // "y_label": "Drinks Consumed"
  },
  "grid": {
    "visible": true,
    "opacity": 0.8,
    "stroke_width": 1
    // frequency?
  },
  "axis": {
    "line_color": "#333",
    "tick_label_color": "#333",
    "tick_label_font": "Arial",
    "tick_label_font_size": 14,
    "x_label": "X Label",
    "y_label": "Y Label",
    "label_color": "#333",
    "label_font": "Arial",
    "label_font_size": 14
  }
};

// this data and the max/min are hardcoded right now, but these eventually need to be dynamic
var chart_data = [40, 60, 25, 70, 66];
var xScale = null;
var xAxis = null;


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


function createChart(container) {
  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);

  var yScale = d3.scale.linear().range([CHART_HEIGHT, 0]);

  xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
      // .tickFormat(d3.time.format("%Y-%m"));
      // .ticks(10);

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
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + CHART_HEIGHT + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      // .attr("dx", "-.8em")
      // .text(chart_config["axis"]["x_label"])
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
      .text(chart_config["axis"]["y_label"]);

  // Add Grid lines:
  var numberOfTicks = 10;

  var yAxisGrid = yAxis.ticks(numberOfTicks)
    .tickSize(CHART_WIDTH, 0)
    .tickFormat("")
    .orient("right");

  var xAxisGrid = xAxis.ticks(numberOfTicks)
    .tickSize(-CHART_HEIGHT, 0)
    .tickFormat("")
    .orient("top");

  container.append("g")
    .attr('class', "y_grid grid")
    .attr('stroke', "grey")
    .attr('opacity', "0.2")
    .attr('stroke-width', "1")
    .call(yAxisGrid);

  container.append("g")
    .attr('class', "x_grid grid hidden")
    .attr('stroke', "dimgrey")
    .attr('opacity', "0")
    .attr('stroke-width', "1")
    .call(xAxisGrid);


  var bars = container.selectAll(".chart_bar")
    .data(chart_data);

  bars.enter()
    .append("rect")
    .attr("class", "chart_bar")
    .attr("fill", chart_config["bars"]["fill"])
    .attr("stroke", chart_config["bars"]["stroke"])
    .attr("x", function(d, i) { return xScale(i); })
    .attr("width", xScale.rangeBand())
    .attr("y", function(d) { return yScale(d); })
    .attr("height", function(d) { return CHART_HEIGHT - yScale(d); });
}

function updateChartConfigValue(type, key, value) {
  chart_config[type][key] = value;

  // special cases
  if (type == "bars" && key == "spacing") {
    xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
    xScale.domain(chart_data.map(function(d, i) { return i; }));
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    container.selectAll(".x_axis").call(xAxis);
    container.selectAll(".chart_bar").transition()
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d); })
      .attr("height", function(d) { return CHART_HEIGHT - yScale(d); });
  }

  // general cases
  if (type == "bars") {
    container.selectAll(".chart_bar").transition().attr(key, value);
  } else if (type == "grid") {
    container.selectAll(".y_grid").transition().attr(key, value);
  }
}


$(document).ready(function() {
  var container = createSVG();
  // var chart_bars = createChartBars(container);
  createChart(container);
});