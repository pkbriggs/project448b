var themes = {
	"8": {
		"bars": {
			"spacing": 0.5, // amount of spacing between each bar (between 0 and 1)
			"fill": "#e21a71",
			"stroke": "transparent",
			"label_visiblity": true,
			"label_fill": "#333",
			"label_font": "Allan",
			"label_font_size": 10,
			"stroke-width": 1
			// "y_label": "Drinks Consumed"
		},
		"grid": {
			"visiblity": false,
			"opacity": 1,
			"stroke_width": 1
			// frequency?
		},
		"axis": {
			"line_color": "#333",
			"tick_label_color": "#333",
			"tick_label_font": "Lato",
			"tick_label_font_size": 20,
			"x_label": "X Label",
			"y_label": "Y Label",
			"label_color": "#333",
			"label_font": "Lato",
			"label_font_size": 16
		},
		"graph": {
			"width": CHART_WIDTH,
			"height": CHART_HEIGHT,
			"font": "Lato",
			"font-size": 20,
			"color": "#333",
			"title": "Pooper"
		}
	},
	"9": {
		"bars": {
			"spacing": 0.2,
			"fill": "#404081",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#AAA",
			"label_font": "Lato",
			"label_font_size": 14,
			"stroke-width": 1
			// "y_label": "Drinks Consumed"
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.2,
			"stroke_width": 2
			// frequency?
		},
		"axis": {
			"line_color": "#333",
			"tick_label_color": "#333",
			"tick_label_font": "Lato",
			"tick_label_font_size": 10,
			"x_label": "X Label",
			"y_label": "Y Label",
			"label_color": "#333",
			"label_font": "Lato",
			"label_font_size": 20
		},
		"graph": {
			"width": CHART_WIDTH,
			"height": CHART_HEIGHT,
			"font": "Lato",
			"font-size": 24,
			"color": "#31b23b",
			"title": "Yes Man"
		}
	}
};

var current_theme = JSON.parse(JSON.stringify(chart_config));
var new_theme = null;

$(function() {
	var $dropdown = $(".header_dd_display");
	$dropdown.click(function(event) {
		var $target = $(event.target);
		if($target.parent().hasClass("active")) {
			restyleGraph(current_theme);
		}
		if (!$target.hasClass("header_dd_display")) {
			$target = $target.parent();
		}
		$target.toggleClass("active");
	});
});

// For switching up the preview
$(function() {
	var $options = $(".header_options");
	var $lastSelection;
	$options.click(function(event) {
		var $target = $(event.target);
		selection = $target.text();

		restyleGraph(themes[selection]);
		new_theme = themes[selection];
		
		// change bg color to show selection
		if ($lastSelection)
			$lastSelection.css("background-color", "transparent");
		$target.css("background-color", "rgba(0, 0, 0, 0.05)");
		$lastSelection = $target;
	});
});

$(function() {
	var $select = $(".header_dd .submit .select");
	$select.click(function(event) {
		// select the given theme
		current_theme = JSON.parse(JSON.stringify(new_theme));

		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		$dropdown.toggleClass("active");
	});
});

$(function() {
	var $cancel = $(".header_dd .submit .cancel");
	$cancel.click(function(event) {
		// cancel and revert to how it was
		restyleGraph(current_theme);
		
		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		$dropdown.toggleClass("active");
	});
});
