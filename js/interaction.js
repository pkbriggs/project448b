
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
    "label_visiblity": false,
    "label_fill": "#333",
    "label_font_size": 10
    // "y_label": "Drinks Consumed"
  },
  "grid": {
    "visiblity": true,
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
var chart_type = null;
var chart_data = null;

var xScale = null;
var yScale = null;
var xAxis = null;
// code dealing with colors
var color_scale = d3.scale.ordinal();
var num_chart_colors = 0;

// tooltip used to display details
tooltip = Tooltip("vis-tooltip", 230);

function createSVG() {
  // Add an svg element to the DOM
  var svg = d3.select(".vis_container").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT)
    .attr("background", "red");

  // create a container for all of our elements
  var container = svg.append("g");
  window.container = container;

  return container;
}

function setColorScale(domain, colors) {
  // Helper function that sets the color scale
  color_scale.domain(domain);
  color_scale.range(colors);
}

function createChart(container) {
  // give the contain some margins
  container
    .attr("transform", "translate(" + CHART_MARGINS.left + "," + CHART_MARGINS.top + ")");

  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
  yScale = d3.scale.linear().range([CHART_HEIGHT, 0]);

  // We only use this array of maps when we are in "line" mode
  var line_data = color_scale.domain().map(function(name) {
    return {
      name: name,
      values: chart_data.map(function(d) {
        return {label: d.label, value: +d[name]};
      })
    };
  });

  xScale.domain(chart_data.map(function(d, i) { return d["label"]; }));

  if(chart_type === "bar") {
    yScale.domain([0, d3.max(chart_data, function(d) { return d["value"]; })]);
  } else {
    // With many lines, we need to grab the min/max values for the y-axis
    yScale.domain([0,d3.max(line_data, function(c) { return d3.max(c.values, function(v) { return v["value"]; }); })]);
  }

  xAxis = d3.svg.axis().scale(xScale)
      .outerTickSize(1)
      .tickPadding(5)
      .orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale)
      .orient("left")
      .outerTickSize(1)
      .tickPadding(5)
      .ticks(5);

  // Add x-axis to the grid along with the x-axis label
  container.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + CHART_HEIGHT + ")")
      .call(xAxis)
    .append("text") // label for the x axis
      .style("text-anchor", "center")
      .attr("class", "axis_label")
      .attr("dx", CHART_WIDTH/2.2)
      .text(chart_config["axis"]["x_label"])
      .attr("dy", "3.4em");

  // Add y-axis to the grid along with the y-axis label
  container.append("g")
      .attr("class", "y_axis")
      .call(yAxis)
    .append("text") // label for the y axis
      .attr("class", "axis_label")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-3.5em")
      .attr("dx", -CHART_HEIGHT/2.5)
      .style("text-anchor", "end")
      .text(chart_config["axis"]["y_label"]);

  // Code to add the grid lines
  var numberOfTicks = 10;
  var yAxisGrid = yAxis.ticks(numberOfTicks)
    .tickSize(CHART_WIDTH, 0)
    .tickFormat("")
    .orient("right");
  var xAxisGrid = xAxis.ticks(numberOfTicks)
    .tickSize(-CHART_HEIGHT, 0)
    .tickFormat("")
    .orient("top");

  // Add horizontal grid lines to the chart
  container.append("g")
    .attr('class', "y_grid grid")
    .attr('stroke', "grey")
    .attr('opacity', "0.2")
    .attr('stroke-width', "1")
    .attr('visibility', 'visible')
    .call(yAxisGrid);

  // Add vertical grid lines to the chart, but hide them by default
  container.append("g")
    .attr('class', "x_grid grid hidden")
    .attr('stroke', "dimgrey")
    .attr('opacity', "0")
    .attr('stroke-width', "1")
    .attr('visibility', 'hidden')
    .call(xAxisGrid);

  if(chart_type === "line") {
    // Create lines if we are doing a line chart
    var line = d3.svg.line()
  			.x(function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
  			.y(function(d) { return yScale(d["value"]); });

    var lines = container.selectAll(".chart_line")
      .data(line_data)
      .enter().append("g")
        .attr("class", "data_point");

    // Add actual lines as one path svg element
    lines.append("path")
      .attr("class", "chart_line")
      .attr("d", function(d) { return line(d.values); })
      .attr("fill", "none")
      .attr("stroke-width", "1")
      .attr("stroke", function(d) { return color_scale(d.name); });

    // Add points to line chart
    lines.selectAll(".chart_dot")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
      .attr("class", "chart_dot")
      .attr("fill", "transparent")
      .attr("stroke", function(d){ return color_scale(this.parentNode.__data__.name )})
      .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("cy", function(d) { return yScale(d["value"]); })
      .attr("r", "3")
        .on("mouseover", showDetails)
        .on("mouseout", hideDetails);

    // Add data-labels on top of points in line chart
    lines.selectAll(".chart_bar_label")
      .data(function(d){ return d.values })
      .enter()
      .append("text")
      .attr("class", "chart_bar_label")
      .text(function(d) { return d["value"]; })
      .attr("text-anchor", "middle")
      .attr("font-size", "10")
      .attr("font-family", "sans-serif")
      .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("y", function(d) { return yScale(d["value"]) - 7; })
      .attr("visibility", "hidden");

  } else {
    // create the chart bars, tie them to the data set
    var bars = container.selectAll(".chart_bar")
      .data(chart_data);

    // Add actual bars to the chart
    bars.enter()
      .append("rect")
      .attr("class", "chart_bar")
      .attr("fill", function(d, i){ return color_scale(i)})
      .attr("stroke", chart_config["bars"]["stroke"])
      .attr("x", function(d, i) { return xScale(d["label"]); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d["value"]); })
      .attr("height", function(d) { return CHART_HEIGHT - yScale(d["value"]); })
        .on("mouseover", showDetails)
        .on("mouseout", hideDetails);

    // Add text underneath the x-axis
    bars.enter()
      .append("text")
      .attr("class", "chart_bar_label")
      .text(function(d) { return d["value"]; })
      .attr("text-anchor", "middle")
      .attr("font-size", "10")
      .attr("font-family", "sans-serif")
      .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("y", function(d) { return yScale(d["value"]) - 7; })
      .attr("visibility", "hidden");
  }
}

$(document).ready(function() {
  $(".chart_image_container").click(function(event) {
    chart_type = $(this).data("type");
    chart_data = setupChartData(chart_type);

    $("#select_chart_container").css("display", "none");

    // Need to add animation here!
    $("#chart_super_container").css("display", "block");
    $("#chart_super_container").css("position", "relative");
    
    var container = createSVG();
    createChart(container);
  });
  
});
