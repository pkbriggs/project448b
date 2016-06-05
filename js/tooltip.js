function Tooltip(tooltipId, width){
  var tooltipId = tooltipId;
  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");


  if(width){
    $("#"+tooltipId).css("width", width);
  }

  hideTooltip();

  function showTooltip(content, event) {
    $("#"+tooltipId).html(content);
    $("#"+tooltipId).show();
    $("#"+tooltipId).css("opacity", "1");
    var font = d3.select(".tick text").attr("font-family");
    $("#"+tooltipId+" .main").css("font-family", '"'+font+'"');

    updatePosition(event, tooltipId);
  }

  function hideTooltip(){
    $("#"+tooltipId).hide();
  }

  function updatePosition(event, dom_id){
    var ttid = "#"+dom_id;
    var xOffset = 10;
    var yOffset = 5;

    var toolTipW = $(ttid).width();
    var toolTipeH = $(ttid).height();
    var windowY = $(window).scrollTop();
    var windowX = $(window).scrollLeft();
    var curX = event.pageX;
    var curY = event.pageY;
    var ttleft = ((curX) < $(window).width() / 2) ? curX - toolTipW - xOffset*2 : curX + xOffset;
    if (ttleft < windowX + xOffset){
      ttleft = windowX + xOffset;
    } 
    var tttop = ((curY - windowY + yOffset*2 + toolTipeH) > $(window).height()) ? curY - toolTipeH - yOffset*2 : curY + yOffset;
    if (tttop < windowY + yOffset){
      tttop = curY + yOffset;
    } 

    $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  }
}