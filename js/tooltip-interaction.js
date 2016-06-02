function showDetails(d, i) {
  if(!hover_active || edit_data_active) return;
  var content = '<p class="main">' + d.label + '</span></p>';
  content += '<hr class="tooltip-hr">'
  content += '<p class="main">' + d.value + '</span></p>'
  tooltip.showTooltip(content, d3.event);

  if(chart_type === "bar") {
  	highlightBar(this);
  } else {
  	highlightDot(this);
  }
  return d3.select(this);
};

function hideDetails(d, i) {
  if(!hover_active) return;
  tooltip.hideTooltip();
  if(edit_data_active) return;
  if(chart_type === "bar") {
  	unHighlightBars();
  } else {
  	unHighlightDots();
  }
  return d3.select(this);
};

function highlightBar(selected) {
  unHighlightBars();
  // highlight the bar we are editing
  $(".chart_bar").each(function( index ) {
    if($(this).is(selected) === false) {
      $(this).css("opacity", 0.3);
    }
  });
}

function unHighlightBars() {
  $(".chart_bar").css("opacity", 1);  // reset opacity
}

function unHighlightDots() {
  $(".chart_line, .chart_dot").css("opacity", 1);  // reset opacity
}

function highlightDot(selected) {
	unHighlightDots();
  // highlight the dot we are editing
  $(".chart_dot").each(function( index ) {
    if($(this).is(selected) === false) {
      $(this).css("opacity", 0.3);
    }
  });
  $(".chart_line").css("opacity", 0.3);
}