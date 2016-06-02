$(function() {

	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var val_of_input = $(this).val();
		var type = $(this).data("type");
		var key = $(this).data("key");
		var is_bar_label = ($(this).data("label") !== undefined) ? true : false;

		// Call function to update bar chart
		updateChartConfigValue(type, key, val_of_input, is_bar_label);
	});

	function switchBarColorMode(selected_radio_btn) {
		var selected_val = $(selected_radio_btn).val();
		if(selected_val === "uniform") {
			$("#unique_colorpicker_container").fadeOut(250, function() {
				$("#uniform_colorpicker_container").fadeIn(250);
			});
			using_single_color = true;
		} else {
			$("#uniform_colorpicker_container").fadeOut(250, function() {
				$("#unique_colorpicker_container").fadeIn(250);
			});
			using_single_color = false;
		}
	}

	// Dealing with buttons that show/hide elements on the graph
	var $radio_btns = $("input[type=radio]");
	$radio_btns.click(function(event) {
		if($(this)[0].name === "bar_color_toggle") {
			switchBarColorMode($(this)[0]);
			return;
		}
		var to_show = ($(this).val() === "Show") ? "visible" : "hidden";
		var type = $(this).data("type");
		var key = $(this).data("key");
		var is_bar_label = ($(this).data("label") !== undefined) ? true : false;
		if(type === undefined) {  // Hover interaction
			if($(this).val() === "Show") {
				hover_active = true;
			} else {
				hover_active = false;
			}
			return;
		}
		// Call function to update bar chart
		updateChartConfigValue(type, key, to_show, is_bar_label);
	});
});

 $(function() {
  $cp = $(".cp").colorpicker();
  $cp.on("changeColor", function(event) {
  	var color = $(this).data('colorpicker').color.toHex();
  	console.log(color);
  	var type = $(this).data("type");
		var key = $(this).data("key");
		var is_bar_label = ($(this).data("label") !== undefined) ? true : false;
		updateChartConfigValue(type, key, color, is_bar_label);
  });

});
