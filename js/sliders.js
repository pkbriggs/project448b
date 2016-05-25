var decimal_scaling = 100; // so that we can have miles to 1 decimal point

$(function() {
  $( ".slider" ).slider({
    range: false,
    min: 0,
    max: 100,
    value: 25,
    slide: function(event, ui) {
      var new_value = ui.value / decimal_scaling;
      $(this).prev().text(ui.value + "%");      
    }
  });
    $(this).prev().text($(".slider").slider("value") + "%");
});