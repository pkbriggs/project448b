$(function() {	

	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var val_of_input = $(this).val();
		var type = $(this).data("type");
		var key = $(this).data("key");

		if(type === "grid" && key === "opacity" && $("input:radio[name=grid_toggle]:checked").val() == "Hide")
			// Edge case where the user has already hidden the grid lines. If they then change the opacity,
			// we don't do anything. DISCUSS behavior here!
			return;

		// Call function to update bar chart
		updateChartConfigValue(type, key, val_of_input);
	});

	// Dealing with buttons that show/hide elements on the graph
	var $radio_btns = $("input[type=radio]");
	$radio_btns.click(function(event) {
		var to_show = ($(this).val() === "Show") ? $("#grid_line_opacity").val() : "0";
		var type = $(this).data("type");
		var key = $(this).data("key");

		if(key === "visible") {
			key = "opacity";
		}
		
		// Call function to update bar chart
		updateChartConfigValue(type, key, to_show);
	});
});