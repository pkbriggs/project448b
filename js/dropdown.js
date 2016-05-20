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
		var font = $target.text();
		var $dropdown = $target.parent().prev();
		$dropdown.toggleClass("active");
		var $selection = $dropdown.find("span");
		console.log($selection);
		$selection.text(font);
	});
});