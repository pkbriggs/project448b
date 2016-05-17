
// declaring constants
var CANVAS_WIDTH = $(window).width() - 300;
var CANVAS_HEIGHT = CANVAS_WIDTH;


function createSVG() {
  // Add an svg element to the DOM
  var svg = d3.select(".vis_container").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

  // create a container for all of our elements
  var container = svg.append("g");


  var circle1 = container.append("circle")
    .attr("cx", 100)
    .attr("cy", 400)
    .attr("r", 80)
    .attr("fill", "#333");

  var circle2 = container.append("circle")
    .attr("cx", 300)
    .attr("cy", 400)
    .attr("r", 80)
    .attr("fill", "#333");

  var rect = container.append("rect")
    .attr("x", 140)
    .attr("y", 100)
    .attr("height", 400)
    .attr("width", 120)
    .attr("fill", "#333");

}


$(document).ready(function() {
  createSVG();
});