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

  // Edge case #1
  if (type == "bars" && key == "spacing") {
    redrawXAxis();  // Redraw x-axis

    container.selectAll(".chart_bar_label")  // Re-draw bar labels
      .attr("x", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; });

    if(chart_type === "line") {
      var line = d3.svg.line()  // Redo line drawing function to account for changes
  			.x(function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
  			.y(function(d) { return yScale(d["value"]); });

      container.selectAll(".chart_line")  // Re-draw lines
        .attr("d", function(d) { return line(d.values); });

      container.selectAll(".chart_dot")  // Re-draw points
        .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2;})
        .attr("cy", function(d) { return yScale(d["value"]); });
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
      $(".x_axis .tick line, .y_axis .tick line").css("stroke", value);

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
  }
}

// helper function that redraws the x-axis
function redrawXAxis() {
  // Re-scale x-axis to change spacing - foundation for all spacing changes
  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
  xScale.domain(chart_data.map(function(d, i) { return d["label"]; }));
  xAxis = d3.svg.axis().scale(xScale).outerTickSize(1).tickPadding(5).orient("bottom");

  container.selectAll(".x_axis").transition().duration(150).call(xAxis);  // Re-draw axis
  container.selectAll(".chart_bar")  // Re-draw bars
    .attr("x", function(d, i) { return xScale(d["label"]); })
    .attr("width", xScale.rangeBand());
}

/*
 * Function contains handlers to setup the edit_data_container, allowing users to
 * edit chart data in a popup modal
 */
function setupEditDataContainer() {
  // handler to take the data currently in the edit_data_container
  // and edit the chart corresondly
  $("#edit_data_change_btn").click(function(event) {
    var obj_to_change = $("#edit_data_container").data("obj");
    var index = $("#edit_data_container").data("index");

    // set obj to new variables from the edit_data_container
    obj_to_change.label = $("#edit_input_label").val()
    obj_to_change.value = $("#edit_input_value").val()
    chart_data[index] = obj_to_change;

    if(chart_type === "bar") {
      // update the bar chart - redraw the actual bars
      container.selectAll(".chart_bar").data(chart_data).transition().duration(300)
        .attr("y", function(d) { return yScale(d["value"]); })
        .attr("height", function(d) { return CHART_HEIGHT - yScale(d["value"]); });

      // update the bar labels
      container.selectAll(".chart_bar_label").transition().duration(300)
        .text(function(d) { return d["value"]; })
        .attr("y", function(d) { return yScale(d["value"]) - 7; });

      // update the axis to reflect changes to the labels
      redrawXAxis();
    }
  });

  // handler to close the edit data container if you click outside of it
  $(document).click(function(event) {
    var clicked = $(event.target);
    if(!clicked.is("#edit_data_container") && !clicked.parents().is("#edit_data_container")) {
      // case: we hide the edit_data_container if we click outside of it
      if($("#edit_data_container").data("open") === "true") {
        // case: we hide the edit_data_container if it is already open
        $("#edit_data_container").data("open", "false");
        $("#edit_data_container").hide();
      }
    }
  });
}