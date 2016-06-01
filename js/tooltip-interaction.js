function showDetails(d, i) {
  if(!hover_active || edit_data_active) return;
  var content = '<p class="main">' + d.label + '</span></p>';
  content += '<hr class="tooltip-hr">'
  content += '<p class="main">' + d.value + '</span></p>'
  tooltip.showTooltip(content, d3.event);
  return d3.select(this).style("stroke", "black").style("stroke-width", 2.0);
};

function hideDetails(d, i) {
  if(!hover_active) return;
  tooltip.hideTooltip();
  return d3.select(this).style("stroke", "black").style("stroke-width", 1.0);
};
