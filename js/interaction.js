
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
var chart_type = $("#chart_info").data("type");
if(chart_type === "bar") {
  var chart_data = [
    {
      "value": 40,
      "label": "fruits"
    },
    {
      "value": 60,
      "label": "vegetables"
    },
    {
      "value": 25,
      "label": 1966
    },
    {
      "value": 70,
      "label": "onomatopoeia"
    },
    {
      "value": 66,
      "label": "hi"
    }
  ];
} else {
  var chart_data = [
    {
      "label": "January",
      "val_one": 40,
      "val_two": 13,
      "val_three": 70,
      "val_four": 6
    },
    {
      "label": "February",
      "val_one": 50,
      "val_two": 29,
      "val_three": 40,
      "val_four": 15
    },
    {
      "label": "March",
      "val_one": 10,
      "val_two": 40,
      "val_three": 50,
      "val_four": 5
    },
    {
      "label": "April",
      "val_one": 14,
      "val_two": 35,
      "val_three": 55,
      "val_four": 8
    },
    {
      "label": "May",
      "val_one": 70,
      "val_two": 60,
      "val_three": 15,
      "val_four": 13,
    }
  ];
}
var xScale = null;
var yScale = null;
var xAxis = null;
var color_scale = null;
var lines = null;


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

  color_scale = d3.scale.ordinal();
  if(chart_type === "bar") {
    setColorScale([0, 1, 2, 3, 4], ["#333", "red", "teal", "orange", "green"]);
  } else {
    setColorScale(["val_one", "val_two", "val_three", "val_four"], ["#333", "teal", "orange", "green"]);
  }

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
    yScale.domain([
      0,
      d3.max(line_data, function(c) { return d3.max(c.values, function(v) { return v["value"]; }); })
    ]);
  }

  xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

  // x axis
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

  // y axis
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
    .attr('visibility', 'visible')
    .call(yAxisGrid);

  container.append("g")
    .attr('class', "x_grid grid hidden")
    .attr('stroke', "dimgrey")
    .attr('opacity', "0")
    .attr('stroke-width', "1")
    .attr('visibility', 'visible')
    .call(xAxisGrid);

  if(chart_type === "line") {
    // Create lines if we are doing a line chart
    var line = d3.svg.line()
  			.x(function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
  			.y(function(d) { return yScale(d["value"]); });

    lines = container.selectAll(".chart_line")
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
      .attr("fill", "none")
      .attr("stroke", function(d){ return color_scale(this.parentNode.__data__.name )})
      .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("cy", function(d) { return yScale(d["value"]); })
      .attr("r", "3");

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

    // when the bars are first created, do these things
    bars.enter()
      .append("rect")
      .attr("class", "chart_bar")
      .attr("fill", function(d, i){ return color_scale(i)})
      .attr("stroke", chart_config["bars"]["stroke"])
      .attr("x", function(d, i) { return xScale(d["label"]); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d["value"]); })
      .attr("height", function(d) { return CHART_HEIGHT - yScale(d["value"]); })

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

function updateChartConfigValue(type, key, value, is_bar_label) {
  if(type !== "change_color_scale") {
    if(is_bar_label === true) {
      chart_config[type]["label_" + key] = value;
    } else {
      chart_config[type][key] = value;
    }
  }

  // special cases
  if (type == "bars" && key == "spacing") { // TODO: Clean me up
    xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
    xScale.domain(chart_data.map(function(d, i) { return d["label"]; }));
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    container.selectAll(".x_axis").call(xAxis);  // Re-draw axis
    container.selectAll(".chart_bar")  // Re-draw bars
      .attr("x", function(d, i) { return xScale(d["label"]); })
      .attr("width", xScale.rangeBand());

    container.selectAll(".chart_bar_label")  // Red-draw bar labels
      .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("y", function(d) { return yScale(d["value"]) - 7; });

    if(chart_type === "line") {
      var line = d3.svg.line()
  			.x(function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
  			.y(function(d) { return yScale(d["value"]); });

      container.selectAll(".chart_line")  // Re-draw lines
        .attr("d", function(d) { return line(d.values); });

      container.selectAll(".chart_dot")  // Re-draw points
        .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
        .attr("cy", function(d) { return yScale(d["value"]); });
    }
  }

  // general cases
  if (type === "bars") {
    if(!is_bar_label) {
      if(chart_type === "bar") {
        container.selectAll(".chart_bar").transition().attr(key, value);
      } else {
        // Changes all the colors at once!
        if(key === "fill") {
          container.selectAll(".chart_dot").transition().attr("stroke", value);
        } else {
          container.selectAll(".chart_line").transition().attr(key, value);
        }
      }
    } else {
      container.selectAll(".chart_bar_label").transition().attr(key, value);
    }

  } else if (type === "grid") {
    container.selectAll(".y_grid").transition().attr(key, value);

  } else if (type === "axis") {
    if(key === "line_color") {
      container.selectAll(".x_axis path, .y_axis path").transition().attr("fill", value);

    } else if (key === "tick_label_color") {
      container.selectAll(".x_axis .tick, .y_axis .tick").transition().attr("fill", value);

    } else if (key === "tick_label_font_size") {
      container.selectAll(".x_axis .tick text, .y_axis .tick text").transition().attr("font-size", value);

    } else if (key === "x_label") {
      container.selectAll(".x_axis .axis_label").transition().text(value);

    } else if (key === "y_label") {
      container.selectAll(".y_axis .axis_label").transition().text(value);

    } else if (key === "label_color") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").transition().attr("fill", value);

    } else if (key === "label_font_size") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").transition().attr("font-size", value);
    }

  } else if (type === "change_color_scale") {
    if(chart_type === "line") {
      lines.selectAll(".chart_line")  // Re-color line
        .attr("stroke", function(d) { return color_scale(d.name); });

      lines.selectAll(".chart_dot")  // Re-color points
        .attr("stroke", function(d){ return color_scale(this.parentNode.__data__.name )})
    }
  }
}


$(document).ready(function() {
  var container = createSVG();
  // var chart_bars = createChartBars(container);
  createChart(container);
});
