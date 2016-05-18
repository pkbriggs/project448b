$(function() {

	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var val_of_input = $(this).val();

		var type = $(this).data("type");
		var key = $(this).data("key");

		updateChartConfigValue(type, key, val_of_input);
	});

	// Dealing with buttons that show/hide elements on the graph
	var $radio_btns = $("input[type=radio]");
	$radio_btns.click(function(event) {
		var to_show = ($(this).val() === "Show")

		var type = $(this).data("type");
		var key = $(this).data("key");

		console.log("Type: " + type + " key: " + key + " val_of_input: " + to_show);

		// Call function to update bar chart
	});
});