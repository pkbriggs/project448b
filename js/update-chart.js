/*
 * Main function that updates values in the global map as well as redraws
 * different parts of the graph. If you wanted to change the opacity of the
 # grid lines, you could call:
 *
 * updateChartConfigValue("grid", "opacity", "0.4", false)
 */
function updateChartConfigValue(type, key, value, is_bar_label) {
  if(type !== "change_color_scale") {
    if(is_bar_label === true) {
      chart_config[type]["label_" + key] = value;
    } else {
      chart_config[type][key] = value;
    }
  }

  // Edge case #1 - changing spacing for chart (both bar/line)
  if (type == "bars" && key == "spacing") {

    if(chart_type === "line") {
      type = "graph";
      key = "width";
      value = ORIG_CHART_WIDTH * value;
    } else {
      redrawXAxis();  // Re-draw x-axis and bars
      redrawBars();  // Re-draw the bars/bar labels
    }
  }

  // General cases
  if (type === "bars") {
    if(!is_bar_label) {
      if(chart_type === "bar") {
        container.selectAll(".chart_bar").attr(key, value);
      } else {
        // Changes all the colors on the bar to one color: FIX!
        if(key === "fill") {
          container.selectAll(".chart_dot").attr("stroke", value);
          container.selectAll(".chart_dot").attr("fill", value);
        } else {
          container.selectAll(".chart_line").attr(key, value);
          if(key === "stroke-width") container.selectAll(".chart_dot").attr("r", value*1.5);
        }
      }
    } else {
      if (key == "label_font") {
        $(".chart_bar_label").css("font-family", value);
      }
      container.selectAll(".chart_bar_label").attr(key, value);
    }

  } else if (type === "grid") {
    container.selectAll(".y_grid").attr(key, value);

  } else if (type === "axis") {
    if(key === "line_color") {
      container.selectAll(".x_axis path, .y_axis path").attr("fill", value);
      $(".x_axis .tick line, .y_axis .tick line").css("stroke", value);

    } else if (key === "tick_label_color") {
      container.selectAll(".x_axis .tick, .y_axis .tick").attr("fill", value);

    } else if (key === "tick_label_font") {
      container.selectAll(".x_axis .tick text, .y_axis .tick text").attr("font-family", value); // doesn't do anything?
      $(".x_axis .tick text, .y_axis .tick text").css("font-family", value);

    } else if (key === "tick_label_font_size") {
      container.selectAll(".x_axis .tick text, .y_axis .tick text").attr("font-size", value);

    } else if (key === "x_label") {
      container.selectAll(".x_axis .axis_label").text(value);
      redrawAxisLabels();

    } else if (key === "y_label") {
      container.selectAll(".y_axis .axis_label").text(value);
      redrawAxisLabels();

    } else if (key === "label_color") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").attr("fill", value);

    } else if (key === "label_font") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").attr("font-family", value); // doesn't do anything?
      $(".y_axis .axis_label, .x_axis .axis_label").css("font-family", value);

    } else if (key === "label_font_size") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").attr("font-size", value);
    }

  } else if (type === "change_color_scale") {
    // When the function is called with type === "change_color_scale", we are
    // changing specific colors. This call is usually preceeded by a change
    // to the color_scale.range() variable using the setColorScale method
    if(chart_type === "line") {
      container.selectAll(".chart_line")  // Re-color line
        .attr("stroke", function(d) { return color_scale(d.name); });
      container.selectAll(".chart_dot")  // Re-color points
        .attr("stroke", function(d){ return color_scale(this.parentNode.__data__.name )})
    } else {
      container.selectAll(".chart_bar")  // Re-color bars
        .attr("fill", function(d, i){ return color_scale(i)})
    }

  } else if (type === "graph") {
    if(key === "width") {
      CHART_WIDTH = parseInt(value);
      $("#graph_width_input").val(CHART_WIDTH);
    } else if (key === "height") {
      CHART_HEIGHT = parseInt(value);
    } else {
      if(key === "title") {
        container.selectAll(".chart_title").text(value);
        redrawAxisLabels();
      } else if (key === "font") {
        $(".chart_title").css("font-family", value);
      } else {
        container.selectAll(".chart_title").attr(key, value);
      }
    }

    // redraw all the graph elements
    redrawXAxis();
    redrawGrid();
    redrawAxisLabels();
    redrawBars();
    updateLineData();
    redrawSvgAndContainer();
  }
}

// helper function that redraws the x-axis
function redrawXAxis() {
  // Re-scale x-axis
  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
  xScale.domain(chart_data.map(function(d, i) { return d["label"]; }));
  xAxis = d3.svg.axis().scale(xScale).outerTickSize(1).tickPadding(5).orient("bottom");

  container.selectAll(".x_axis").attr("transform", "translate(0," + CHART_HEIGHT + ")").call(xAxis);  // Re-draw axis
}

// helper function that redraws the y-axis
function redrawYAxis(line_data) {
  // Re-scale y-axis
  yScale = d3.scale.linear().range([CHART_HEIGHT, 0]);
  if(chart_type === "bar") {
    yScale.domain([0, d3.max(chart_data, function(d) { return d["value"]; })]);
  } else {
    yScale.domain([0,d3.max(line_data, function(c) { return d3.max(c.values, function(v) { return v["value"]; }); })]);
  }
  yAxis = d3.svg.axis().scale(yScale).outerTickSize(1).tickPadding(5).ticks(5).orient("left");

  container.selectAll(".y_axis").call(yAxis);  // Re-draw axis
}

// helper function to redraw the grid
function redrawGrid() {
  var yAxisGrid = yAxis.ticks(10).tickSize(CHART_WIDTH, 0).orient("right").tickFormat("");
  container.selectAll(".y_grid").call(yAxisGrid);  // Re-draw axis
}

// helper function to redraw the axis labels
function redrawAxisLabels() {
  container.selectAll(".x_axis_label").attr("dx", CHART_WIDTH/2 - $(".x_axis_label").width()/2 - 5);
  container.selectAll(".y_axis_label").attr("dx", -CHART_HEIGHT/2 + $(".y_axis_label").width()/2);
  container.select(".chart_title").attr("x", CHART_WIDTH/2.0 - $(".chart_title").width()/2.0 - 15);
}

// helper function that re-draws the bars
function redrawBars() {
  redrawBarLabels();  // re-draw the bar labels
  // update the actual bars
  container.selectAll(".chart_bar").data(chart_data)
    .attr("y", function(d) { return yScale(d["value"]); })
    .attr("x", function(d, i) { return xScale(d["label"]); })
    .attr("width", xScale.rangeBand())
    .attr("height", function(d) { return CHART_HEIGHT - yScale(d["value"]); });
}

// helper funtion to update data behind the line chart
function updateLineData() {
  var line_data = color_scale.domain().map(function(name) {
    return {
      name: name,
      values: chart_data.map(function(d) {
        return {label: d.label, value: +d[name]};
      })
    };
  });
  redrawYAxis(line_data);
  var line = d3.svg.line()  // Redo line drawing function to account for changes
    .x(function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
    .y(function(d) { return yScale(d["value"]); });

  var lines = container.selectAll(".chart_line").data(line_data)
    .attr("d", function(d) { return line(d.values); });
  var points = container.selectAll(".data_point").data(line_data);

  redrawDotsAndLabels(points); // update the dots/line-labels
}

// helper function that re-draws the dots and data labels
function redrawDotsAndLabels(points) {
  points.selectAll(".chart_dot")  // Re-draw points
    .data(function(d){ return d.values; })
    .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
    .attr("cy", function(d) { return yScale(d["value"]); })

  // Change color of tick labels
  container.selectAll(".x_axis .tick, .y_axis .tick").transition().attr("fill", chart_config["axis"]["tick_label_color"]);

  points.selectAll(".chart_bar_label")  // re-draw line-labels
    .data(function(d){ return d.values; })
    .text(function(d) { return d["value"]; })
    .attr("y", function(d) { return yScale(d["value"]) - 7; })
    .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; });
}

// helper function that re-draws the data labels above the points on the chart
function redrawBarLabels() {
  // update the data labels
  container.selectAll(".chart_bar_label")
    .text(function(d) { return d["value"]; })
    .attr("y", function(d) { return yScale(d["value"]) - 7; })
    .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; });
}

// function that re-draws the svg and re-centers it
function redrawSvgAndContainer() {
  var actual_chart_height = d3.select(".actual_chart").node().getBoundingClientRect().height;
  var actual_chart_width = d3.select(".actual_chart").node().getBoundingClientRect().width;

  d3.select("svg").attr("height", actual_chart_height + 40);
  d3.select("svg").attr("width", actual_chart_width);

  $(".vis_container").attr("height", actual_chart_height + 40);
  $(".vis_container").attr("width", actual_chart_width);

  var space_to_add_at_top = ($("#chart_super_container").height() - $(".vis_container").height() - $("header").height()) / 2.0;
  $(".vis_container").css("margin-top", space_to_add_at_top);
}

/*
 * Function contains handlers to setup the edit_data_container, allowing users to
 * edit chart data in a popup modal
 */
function setupEditDataContainer() {
  // handler to take the data currently in the edit_data_container
  // and edit the chart corresondly
  $(".edit_input").keyup(function(event) {
    var obj_to_change = $("#edit_data_container").data("obj");
    var index = $("#edit_data_container").data("index");
    var key_for_line = $("#edit_data_container").data("key");

    // set obj to new variables from the edit_data_container
    obj_to_change.label = $("#edit_input_label").val();
    if(chart_type === "bar") {
      obj_to_change.value = $("#edit_input_value").val();
    } else {
      obj_to_change[key_for_line] = parseInt($("#edit_input_value").val());
    }
    chart_data[index] = obj_to_change;

    redrawXAxis();  // update the axis to reflect changes to the labels
    if(chart_type === "bar") {
      redrawYAxis("");
      redrawBars();  // update the bars
    } else {
      updateLineData();
    }

    // hideEditDataContainer();  // hide it when we are done
  });

  // handler to close the edit data container if you click outside of it
  $(document).click(function(event) {
    var clicked = $(event.target);
    if(!clicked.is("#edit_data_container") && !clicked.parents().is("#edit_data_container")) {
      // case: we hide the edit_data_container if we click outside of it
      if(!clicked.is(".chart_dot") && !clicked.is(".chart_bar")) {
        // case: we hide the edit_data_container if we click outside of a chart dot or line
        if($("#edit_data_container").data("open") === "true") {
          // case: we hide the edit_data_container if it is already open
          hideEditDataContainer();
        }
      }
    }
  });
}

// helper function that hides the edit_data_container
function hideEditDataContainer() {
  tooltip.hideTooltip();
  $("#edit_data_container").data("open", "false");
  $("#edit_data_container").hide();
  $(".chart_bar, .chart_line, .chart_dot").css("opacity", "1");
  edit_data_active = false;
}

// function that shows the edit_data_container and populates it
// with the necessary values from the clicked on point
function showEditDataContainer(mouse_event, d, i, key_for_line) {
  tooltip.hideTooltip();
  // update the input fields with the clicked on bar's data
  $("#edit_input_label").val(d.label);
  $("#edit_input_value").val(d[key_for_line]);
  $("#edit_data_container").show();

  // set the current obj and index inside the edit_data_container
  $("#edit_data_container").data("obj", d);
  $("#edit_data_container").data("index", i);
  $("#edit_data_container").data("key", key_for_line);
  $("#edit_data_container").data("open", "true");
  tooltip.updatePosition(mouse_event, "edit_data_container");
  edit_data_active = true;
}

// method that takes data from the passed in hashmap and
// restyles the chart with it
function restyleGraph(preset_config) {
  // Update the bars/lines
  for (var key in preset_config["bars"]) {
    var value = preset_config["bars"][key];
    if(key.indexOf("label") !== -1) {
      // dealing with data labels
      updateChartConfigValue("bars", key, value, true);
    } else {
      if(key === "stroke" && chart_type === "line" && value === "transparent"){
        value = "#333";
      }
      updateChartConfigValue("bars", key, value, false);
    }
  }

  // Update the grid
  restyleComponent(preset_config, "grid")
  // Update the axis
  restyleComponent(preset_config, "axis")
  // update the graph components
  restyleComponent(preset_config, "graph")
  // make changes appear in the controls too!
  applyStyleToAllControls(preset_config);
}

function restyleComponent(preset_config, type) {
  for (var key in preset_config[type]) {
    var value = preset_config[type][key];
    updateChartConfigValue(type, key, value, false);
  }
}

function applyStyleToAllControls(config) {
  applyLineOrBarStyleToControls(config);

  applyGridStyleToControls(config);

  applyAxisStyleToControls(config);

  applyGraphStyleToControls(config);
}

function applyLineOrBarStyleToControls(config) {
  // line/bar spacing controls
  $($(".slider")[0]).slider("value", config["bars"]["spacing"] * 100);
  $($(".slider_reading")[0]).text(config["bars"]["spacing"] * 100 +"%");
  // line/bar stroke color
  $($("#single_stroke_cp").colorpicker()[0]).colorpicker('setValue', config["bars"]["stroke"]);
  // line/bar fill color
  $($("#single_fill_cp").colorpicker()[0]).colorpicker('setValue', config["bars"]["fill"]);
  // line/bar label color
  $($("#bar-label-cp").colorpicker()[0]).colorpicker('setValue', config["bars"]["label_fill"]);
  // line/bar label font-size
  $("#label-font-size-dropdown span").text(config["bars"]["label_font_size"]);
  // add line/bar label font
  $("#bar-label-font-dropdown span").text(config["bars"]["label_font"]);
  loadFont(config["bars"]["label_font"]);
  // line/bar label toggle
  if(config["bars"]["label_visiblity"] === true) {
    $("input:radio[name=bar_label_toggle]")[0].click()
  } else {
    $("input:radio[name=bar_label_toggle]")[1].click()
  }
}

function applyGridStyleToControls(config) {
  // grid visibility
  if(config["grid"]["visiblity"] === true) {
    $("input:radio[name=grid_toggle]")[0].click()
  } else {
    $("input:radio[name=grid_toggle]")[1].click()
  }
  // grid opacity
  $($(".slider")[1]).slider("value", config["grid"]["opacity"] * 100);
  $($(".slider_reading")[1]).text(config["grid"]["opacity"] * 100 +"%");
  // grid stroke width
  $("#grid-width-input").val(config["grid"]["stroke_width"]);
}

function applyAxisStyleToControls(config) {
  // axis color
  $($("#axis-color-cp").colorpicker()[0]).colorpicker('setValue', config["axis"]["line_color"]);
  // axis x-label
  $("#x-label-input").val(config["axis"]["x_label"]);
  // axis y-label
  $("#y-label-input").val(config["axis"]["y_label"]);
  // axis - tick label color
  $($("#tick-label-cp").colorpicker()[0]).colorpicker('setValue', config["axis"]["tick_label_color"]);
  // axis - tick label font-size
  $("#tick-label-font-size-dropdown span").text(config["axis"]["tick_label_font_size"]);
  // axis - tick label font
  $("#tick-label-font-dropdown span").text(config["axis"]["tick_label_font"]);
  loadFont(config["graph"]["font"]);
  // axis - label color
  $($("#axis-label-cp").colorpicker()[0]).colorpicker('setValue', config["axis"]["label_color"]);
  // axis - tick label font-size
  $("#axis-label-font-size-dropdown span").text(config["axis"]["label_font_size"]);
  // axis - tick label font
  $("#axis-label-font-dropdown span").text(config["axis"]["label_font"]);
  loadFont(config["graph"]["font"]);
}

function applyGraphStyleToControls(config) {
  // graph title
  $("#graph-title-input").val(config["graph"]["title"]);
  // graph title font size
  $("#graph-title-font-size-options span").text(config["graph"]["font-size"]);
  // add graph title font
  $("#graph-title-font-dropdown span").text(config["graph"]["font"]);
  loadFont(config["graph"]["font"]);
  // graph title color
  $($("#graph-title-cp").colorpicker()[0]).colorpicker('setValue', config["graph"]["color"]);
}