
// declaring constants
var CANVAS_WIDTH = $(window).width() - 500;
var CANVAS_HEIGHT = $(window).height() * 0.8;
var OUTPUT_FILENAME = "chart.png";
var OUTPUT_FILETYPE = "image/png";
var CHART_BACKGROUND_COLOR = "white";

var CHART_MARGINS = {
  top: 50,
  bottom: 90,
  left: 100,
  right: 80
};
var CHART_WIDTH = CANVAS_WIDTH - CHART_MARGINS.left - CHART_MARGINS.right;
var ORIG_CHART_WIDTH = CHART_WIDTH;
var CHART_HEIGHT = CANVAS_HEIGHT - CHART_MARGINS.top - CHART_MARGINS.bottom;

var chart_config = {
  "bars": {
    "spacing": 0.25, // amount of spacing between each bar (between 0 and 1)
    "fill": "#333",
    "stroke": "transparent",
    "label_visiblity": false,
    "label_fill": "#333",
    "label_font": "Droid Sans",
    "label_font_size": 10,
    "stroke-width": 1
    // "y_label": "Drinks Consumed"
  },
  "grid": {
    "visiblity": true,
    "opacity": 0.25,
    "stroke_width": 1
    // frequency?
  },
  "axis": {
    "line_color": "#333",
    "tick_label_color": "#333",
    "tick_label_font": "Droid Sans",
    "tick_label_font_size": 14,
    "x_label": "X Label",
    "y_label": "Y Label",
    "label_color": "#333",
    "label_font": "Droid Sans",
    "label_font_size": 14
  },
  "graph": {
    "width": CHART_WIDTH,
    "height": CHART_HEIGHT,
    "font": "Droid Sans",
    "font-size": "20",
    "color": "#333",
    "title": "My Graph"
  }
};

// this data and the max/min are hardcoded right now, but these eventually need to be dynamic
var chart_type = null;
var chart_data = null;

var xScale = null;
var yScale = null;
var xAxis = null;
var yAxis = null;
// code dealing with colors
var color_scale = d3.scale.ordinal();
var num_chart_colors = 0;
var using_single_color = true;
var hover_active = false;
var edit_data_active = false;

// tooltip used to display details
tooltip = Tooltip("vis-tooltip", 230);

function createSVG() {
  $("#graph_width_input").val(CHART_WIDTH.toFixed(2));
  $("#graph_height_input").val(CHART_HEIGHT.toFixed(2));
  // Add an svg element to the DOM
  var svg = d3.select(".vis_container").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", CHART_BACKGROUND_COLOR);

  // create a container for all of our elements
  var container = svg.append("g").attr("class", "actual_chart");

  // give the contain some margins
  container
    .attr("transform", "translate(" + CHART_MARGINS.left + "," + CHART_MARGINS.top + ")");

  var space_to_add_at_top = ($("#chart_super_container").height() - $(".vis_container").height() - $("header").height()) / 2.0;
  $(".vis_container").css("margin-top", space_to_add_at_top);
  window.container = container;

  return container;
}

function setColorScale(domain, colors) {
  // Helper function that sets the color scale
  color_scale.domain(domain);
  color_scale.range(colors);
}

function createChart(container) {
  xScale = d3.scale.ordinal().rangeRoundBands([0, CHART_WIDTH], chart_config["bars"]["spacing"]);
  yScale = d3.scale.linear().range([CHART_HEIGHT, 0]);

  var $tools = $("header .tools");
  $tools.css("display", "block");
  loadFont("Droid Sans");


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
  yAxis = d3.svg.axis().scale(yScale)
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
      .attr("class", "x_axis_label axis_label")
      .text(chart_config["axis"]["x_label"])
      .attr("dy", "3.4em");

  // Add y-axis to the grid along with the y-axis label
  container.append("g")
      .attr("class", "y_axis")
      .call(yAxis)
    .append("text") // label for the y axis
      .attr("class", "y_axis_label axis_label")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-3.5em")
      .style("text-anchor", "end")
      .text(chart_config["axis"]["y_label"]);

  redrawAxisLabels();

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
    $("#data_styling_title span").text("Line Styling");
    $("#data_label_title").text("Line Labels");
    $("#fill_color_toggles").hide();
    $($("#single_stroke_cp").colorpicker()[0]).colorpicker('setValue', "#333333");
    $($(".slider")[0]).slider("value", 100);
    $($(".slider_reading")[0]).text("100%");
    $("#spacing_title").text("Chart Width");
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
      .attr("fill", function(d){ return color_scale(this.parentNode.__data__.name )} )
      .attr("stroke", function(d){ return color_scale(this.parentNode.__data__.name )})
      .attr("cx", function(d, i) { return xScale(d["label"]) + xScale.rangeBand()/2; })
      .attr("cy", function(d) { return yScale(d["value"]); })
      .attr("r", "2")
        .on("mousemove", showDetails)
        .on("mouseout", hideDetails);

    // Add edit_data interaction upon click
    container.selectAll(".chart_dot").on('click', function (d, i) {
      d3.event.preventDefault();
      var actual_index = i % chart_data.length;
      var actual_node = chart_data[actual_index];
      var key_for_line = this.parentNode.__data__.name;
      var selected_dot = $(this);

      unHighlightDots(); // reset opacity
      highlightDot(selected_dot);

      showEditDataContainer(d3.event, actual_node, actual_index, key_for_line);
    });

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
    $("#line-stroke-width").hide()  // hide line stroke width
    $("#stroke_color_toggles").hide();
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

    bars.on("mousemove", showDetails)
      .on("mouseout", hideDetails);

    container.selectAll(".chart_bar").on('click', function (d, i) {
      d3.event.preventDefault();
      var selected_bar = $(this);

      unHighlightBars();  // reset opacity
      highlightBar(selected_bar);

      showEditDataContainer(d3.event, d, i, "value");
    });

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

  setupEditDataContainer();
  
  // Add title to the Graph
  container.append("text")
    .attr("class", "chart_title")
    .attr("y", 0 - (CHART_MARGINS.top / 2))
    .attr("font-size", "20px") 
    .text("My Graph");

  redrawAxisLabels();
}

function setupHandlersToHideStylingSections() {
  $(".title").click(function(event) {
    var parent = $(this);
    var child = $(this).find(".toggle_control_vis");

    var style_control_container_class = parent.data("target");
    var visible_status = parent.data("open");

    if(visible_status === "open") {
      $("." + style_control_container_class).fadeOut(250);
      parent.data("open", "closed");
      child.removeClass("fa-chevron-down");
      child.addClass("fa-chevron-right");
    } else {
      $("." + style_control_container_class).fadeIn(250);
      parent.data("open", "open");
      child.addClass("fa-chevron-down");
      child.removeClass("fa-chevron-right");
    }
    
  });
}

// TODO: note source - http://techslides.com/save-svg-as-an-image
function enableSaveButton() {
  d3.select(".save_button").on("click", function(){
    // ensure the canvas we draw to is the correct size
    $(".save_canvas")[0].width = CANVAS_WIDTH;
    $(".save_canvas")[0].height = CANVAS_HEIGHT;

    // get the HTML representing our chart's SVG
    var html = d3.select("svg")
          .attr("version", 1.1)
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .node().parentNode.innerHTML;

    var canvas = $(".save_canvas")[0];
    var context = canvas.getContext("2d");

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {
      context.drawImage(image, 0, 0);

      // save and serve the canvas as an actual filename
      binaryblob();

      var a = document.createElement("a");
      a.download = OUTPUT_FILENAME;
      a.href = canvas.toDataURL(OUTPUT_FILETYPE);
      a.click();
    };

  });
}

function binaryblob(){
  var byteString = atob($(".save_canvas")[0].toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")); //wtf is atob?? https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var dataView = new DataView(ab);
  var blob = new Blob([dataView], {type: "image/png"});
  var DOMURL = self.URL || self.webkitURL || self;
  var newurl = DOMURL.createObjectURL(blob);

  var img = '<img src="'+newurl+'">';
  d3.select("#img").html(img);
}

$(document).ready(function() {
  $(".chart_example_image_container").click(function(event) {
    chart_type = $(this).data("type");
    chart_data = setupChartData(chart_type);

    $("#select_chart_container").fadeOut(250);

    // Need to add animation here!
    $("#chart_super_container").fadeIn(250);
    $("#chart_super_container").css("position", "relative");

    setupHandlersToHideStylingSections();
    var container = createSVG();
    createChart(container);
    enableSaveButton();
    initFontSelector();
  });

});
