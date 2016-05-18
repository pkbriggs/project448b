$(function() {
	// Helper function
	var convertString = function(type_and_key) {
		// type_and_key is something like bar_width
		// we want to extract both bar and width
		var type = type_and_key.substring(0, type_and_key.indexOf("_"));
		var key = type_and_key.substring(type_and_key.indexOf("_") + 1);

		return [type, key];
	};

	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var val_of_input = $(this).val();

		var type_key_array = convertString($(this).data("type"));
		var type = type_key_array[0];
		var key = type_key_array[1];
		if (type == "bar")
			type = "bars";

		console.log("Type: " + type + " key: " + key + " val_of_input: " + val_of_input);
		updateChartConfigValue(type, key, val_of_input);

		// Call function to update bar chart
	});

	// Dealing with buttons that show/hide elements on the graph
	var $radio_btns = $("input[type=radio]");
	$radio_btns.click(function(event) {
		var to_show = ($(this).val() === "Show")

		var type_key_array = convertString($(this)[0].name);
		var type = type_key_array[0];
		var key = type_key_array[1];

		console.log("Type: " + type + " key: " + key + " val_of_input: " + to_show);

		// Call function to update bar chart
	});
});