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
    redrawXAxis();  // Re-draw x-axis and bars

    if(chart_type === "line") {
      updateLineData();  // Re-draw the lines/dots/line labels
    } else {
      redrawBars();  // Re-draw the bars/bar labels
    }
  }

  // General cases
  if (type === "bars") {
    if(!is_bar_label) {
      if(chart_type === "bar") {
        container.selectAll(".chart_bar").transition().attr(key, value);
      } else {
        // Changes all the colors on the bar to one color: FIX!
        if(key === "fill") {
          container.selectAll(".chart_dot").transition().attr("stroke", value);
          container.selectAll(".chart_dot").transition().attr("fill", value);
        } else {
          container.selectAll(".chart_line").transition().attr(key, value);
          if(key === "stroke-width") container.selectAll(".chart_dot").transition().attr("r", value*1.5);
        }
      }
    } else {
      if (key == "label_font") {
        container.selectAll(".chart_bar_label").transition().attr("font-family", value); // doesn't do anything?
        $(".chart_bar_label").css("font-family", value);
      }
      container.selectAll(".chart_bar_label").transition().attr(key, value);
    }

  } else if (type === "grid") {
    container.selectAll(".y_grid").transition().attr(key, value);

  } else if (type === "axis") {
    if(key === "line_color") {
      container.selectAll(".x_axis path, .y_axis path").transition().attr("fill", value);
      $(".x_axis .tick line, .y_axis .tick line").css("stroke", value);

    } else if (key === "tick_label_color") {
      container.selectAll(".x_axis .tick, .y_axis .tick").transition().attr("fill", value);

    } else if (key === "tick_label_font") {
      container.selectAll(".x_axis .tick text, .y_axis .tick text").transition().attr("font-family", value); // doesn't do anything?
      $(".x_axis .tick text, .y_axis .tick text").css("font-family", value);

    } else if (key === "tick_label_font_size") {
      container.selectAll(".x_axis .tick text, .y_axis .tick text").transition().attr("font-size", value);

    } else if (key === "x_label") {
      container.selectAll(".x_axis .axis_label").transition().text(value);

    } else if (key === "y_label") {
      container.selectAll(".y_axis .axis_label").transition().text(value);

    } else if (key === "label_color") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").transition().attr("fill", value);

    } else if (key === "label_font") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").transition().attr("font-family", value); // doesn't do anything?
      $(".y_axis .axis_label, .x_axis .axis_label").css("font-family", value);

    } else if (key === "label_font_size") {
      container.selectAll(".y_axis .axis_label, .x_axis .axis_label").transition().attr("font-size", value);
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
    console.log(value);
    if(key === "width") {
      CHART_WIDTH = parseInt(value);
    } else if (key === "height") {
      CHART_HEIGHT = parseInt(value);
    }

    // redraw everything
    redrawXAxis();
    redrawGrid();
  }
}

// helper function that redraws the x-axis
function redrawXAxis() {
  // Re-scale x-axis to change spacing - foundation for all spacing changes
  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
  xScale.domain(chart_data.map(function(d, i) { return d["label"]; }));
  xAxis = d3.svg.axis().scale(xScale).outerTickSize(1).tickPadding(5).orient("bottom");

  container.selectAll(".x_axis").call(xAxis);  // Re-draw axis
}

// helper function to redraw the grid
function redrawGrid() {
  var yAxisGrid = yAxis.tickSize(CHART_WIDTH, 0)

  container.selectAll(".y_grid").call(yAxisGrid);  // Re-draw axis
}

// helper function that re-draws the bars
function redrawBars() {
  // re-draw the bar labels
  redrawBarLabels();
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
