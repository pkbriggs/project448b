$(function() {
	var $dropdown = $(".dropdown");
	$dropdown.click(function(event) {
		var $target = $(event.target);
		if (!$target.hasClass("dropdown")) {
			$target = $target.parent();
		}
		$target.toggleClass("active");
	});
});

$(function() {
	var $options = $(".options");
	$options.click(function(event) {
		var $target = $(event.target);
		var option = $target.text();
		var $dropdown = $target.parent().prev();
		$dropdown.toggleClass("active");

		var $selection = $dropdown.find("span");
		$selection.text(option);
		var type = $dropdown.data("type");
		var key = $dropdown.data("key");

		if (key == "tick_label_font") {
			$(".legend_text").css("font-family", '"'+option+'"');
		}

		var is_bar_label = ($dropdown.data("label") !== undefined) ? true : false;
		updateChartConfigValue(type, key, option, is_bar_label);
	});
});