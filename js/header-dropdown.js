var current_theme = JSON.parse(JSON.stringify(chart_config));
var current_color_range = JSON.parse(JSON.stringify(color_scale.range()));
var new_theme = null;

$(function() {
	var $dropdown = $(".header_dd_display");
	$dropdown.click(function(event) {
		var $target = $(event.target);
		if($target.parent().hasClass("active")) {
			$(".vis_controls_blanket").fadeOut(250);
			restyleGraph(current_theme);
			color_scale.range(current_color_range);
			individuallyColorChart(color_scale.range());
		} else {
			$(".vis_controls_blanket").fadeIn(250);
			// we need to resave the progress here!
			current_theme = JSON.parse(JSON.stringify(chart_config));
			current_color_range = JSON.parse(JSON.stringify(color_scale.range()));
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

		if(individual_colors[selection]["colors"]["used"] === true) {
			// we need to individually color the chart
			individuallyColorChart(individual_colors[selection]["colors"]);
		}
		
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
		$(".vis_controls_blanket").fadeOut(250);
		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		$dropdown.toggleClass("active");
	});
});

$(function() {
	var $cancel = $(".header_dd .submit .cancel");
	$cancel.click(function(event) {
		$(".vis_controls_blanket").fadeOut(250);
		// cancel and revert to how it was
		restyleGraph(current_theme);
		color_scale.range(current_color_range);
		individuallyColorChart(color_scale.range());
		
		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		$dropdown.toggleClass("active");
	});
});

// ---------------- Themes -----------------

var themes = {
	"Default": {
		"bars": {
			"spacing": 0.3,
			"fill": "#333",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "Lato",
			"label_font_size": 12,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.25,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#333",
			"tick_label_color": "#333",
			"tick_label_font": "Lato",
			"tick_label_font_size": 14,
			"label_color": "#333",
			"label_font": "Lato",
			"label_font_size": 16,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": CHART_WIDTH,
			"height": CHART_HEIGHT,
			"font": "Lato",
			"font-size": 20,
			"color": "#333",
		}
	},

	"Ocean": {
		"bars": {
			"spacing": 0.3,
			"fill": "",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "Didact Gothic",
			"label_font_size": 12,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.1,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#e2e2e2",
			"tick_label_color": "#333",
			"tick_label_font": "Didact Gothic",
			"tick_label_font_size": 14,
			"label_color": "#333",
			"label_font": "Didact Gothic",
			"label_font_size": 16,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": CHART_WIDTH,
			"height": CHART_HEIGHT,
			"font": "Didact Gothic",
			"font-size": 20,
			"color": "#333",
		}
	},

	"Vintage": {
		"bars": {
			"spacing": 0.38,
			"fill": "",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "IM Fell French Canon",
			"label_font_size": 12,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.1,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#e2e2e2",
			"tick_label_color": "#333",
			"tick_label_font": "IM Fell French Canon",
			"tick_label_font_size": 14,
			"label_color": "#333",
			"label_font": "IM Fell French Canon",
			"label_font_size": 16,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": 475,
			"height": CHART_HEIGHT,
			"font": "Cardo",
			"font-size": 24,
			"color": "#333",
		}
	},
	"Neutrals": {
		"bars": {
			"spacing": 0.46,
			"fill": "",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "PT Sans",
			"label_font_size": 10,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.13,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#acacac",
			"tick_label_color": "#333",
			"tick_label_font": "PT Sans",
			"tick_label_font_size": 14,
			"label_color": "#333",
			"label_font": "PT Sans",
			"label_font_size": 16,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": 475,
			"height": CHART_HEIGHT,
			"font": "PT Sans",
			"font-size": 24,
			"color": "#333",
		}
	},
	"Green": {
		"bars": {
			"spacing": 0.48,
			"fill": "#699d80",
			"stroke": "#46775c",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "Coming Soon",
			"label_font_size": 12,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.13,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#aeaeae",
			"tick_label_color": "#333",
			"tick_label_font": "Coming Soon",
			"tick_label_font_size": 14,
			"label_color": "#333",
			"label_font": "Coming Soon",
			"label_font_size": 16,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": 500,
			"height": CHART_HEIGHT,
			"font": "Coming Soon",
			"font-size": 24,
			"color": "#333",
		}
	},
	"Sunset": {
		"bars": {
			"spacing": 0.48,
			"fill": "",
			"stroke": "transparent",
			"label_visiblity": false,
			"label_fill": "#333",
			"label_font": "Josefin Sans",
			"label_font_size": 10,
			"stroke-width": 2
		},
		"grid": {
			"visiblity": true,
			"opacity": 0.13,
			"stroke_width": 1
		},
		"axis": {
			"line_color": "#cdc3c8",
			"tick_label_color": "#333",
			"tick_label_font": "Josefin Sans",
			"tick_label_font_size": 16,
			"label_color": "#333",
			"label_font": "Josefin Sans",
			"label_font_size": 18,
			"x_label": "X Label",
			"y_label": "Y Label",
		},
		"graph": {
			"width": 500,
			"height": CHART_HEIGHT,
			"font": "Josefin Sans",
			"font-size": 24,
			"color": "#333",
		}
	},
};

var individual_colors = {
	"Default": {
		"colors": {
			"used": false,
			"0": "",
			"1": "",
			"2": "",
			"3": "",
			"4": ""
		}
	},
	"Ocean": {
		"colors": {
			"used": true,
			"0": "#bcf2c7",
			"1": "#02c39a",
			"2": "#00a896",
			"3": "#028090",
			"4": "#05668d"
		}
	}, 
	"Vintage": {
		"colors": {
			"used": true,
			"0": "#7c847c",
			"1": "#2c343c",
			"2": "#743434",
			"3": "#e4cca4",
			"4": "#c47c64"
		}
	},
	"Vintage": {
		"colors": {
			"used": true,
			"0": "#44545c",
			"1": "#7c6464",
			"2": "#c4846c",
			"3": "#dca474",
			"4": "#344454"
		}
	},
	"Sunset": {
		"colors": {
			"used": true,
			"0": "#fc7834",
			"1": "#ff5434",
			"2": "#cc1c2c",
			"3": "#731630",
			"4": "#40152a"
		}
	}
}