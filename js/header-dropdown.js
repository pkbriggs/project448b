$(function() {
	var $dropdown = $(".header_dd_display");
	$dropdown.click(function(event) {
		var $target = $(event.target);
		if (!$target.hasClass("header_dd_display")) {
			$target = $target.parent();
		}
		$target.toggleClass("active");
	});
});

// For switching up the preview
$(function($lastSelection) {
	var $options = $(".header_options");
	$options.click(function(event) {
		var $target = $(event.target);
		selection = $target.text();
		console.log(selection); // this is the current selected theme
		
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

		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		console.log($dropdown);
		$dropdown.toggleClass("active");
	});
});

$(function() {
	var $cancel = $(".header_dd .submit .cancel");
	$cancel.click(function(event) {
		// cancel and revert to how it was
		
		// to hide the dd again
		var $dropdown = $(event.target).parent().parent().prev();
		console.log($dropdown);
		$dropdown.toggleClass("active");
	});
});
