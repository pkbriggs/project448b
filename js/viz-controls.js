$(function() {
	var $style_input = $(".style_input");
	$style_input.keyup(function(event) {
		var type = $(this).data("type");
		console.log(type);

		var content = $(this).val();
		console.log (content);
	});
});