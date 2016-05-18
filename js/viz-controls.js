$(function() {

	// Helper function
	var convertString = function(category_and_style) {
		// Category_and_style is something like bar_width
		// we want to extract both bar and width
		var category = category_and_style.substring(0, category_and_style.indexOf("_"));
		var style = category_and_style.substring(category_and_style.indexOf("_") + 1);

		return [category, style];
	};

	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var val_of_input = $(this).val();

		var category_style_array = convertString($(this).data("type"));
		var category = category_style_array[0];
		var style = category_style_array[1];

		console.log("Category: " + category + " style: " + style + " val_of_input: " + val_of_input);

		// Call function to update bar chart
	});

	// Dealing with buttons that show/hide elements on the graph
	var $radio_btns = $("input[type=radio]");
	$radio_btns.click(function(event) {
		var to_show = ($(this).val() === "Show")

		var category_style_array = convertString($(this)[0].name);
		var category = category_style_array[0];
		var style = category_style_array[1];

		console.log("Category: " + category + " style: " + style + " val_of_input: " + to_show);

		// Call function to update bar chart
	});
});