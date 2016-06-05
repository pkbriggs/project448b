var font_link_base = "https://fonts.googleapis.com/css?family=";
var google_fonts = [
  "Anonymous+Pro",
  "Allerta",
  "Bentham",
  "Cabin",
  "Cantarell",
  "Cardo",
  "Chewy",
  "Coming+Soon",
  "Didact+Gothic",
  "Droid+Sans",
  "Droid+Serif",
  "Inconsolata",
  "IM+Fell+French+Canon",
  "Josefin+Sans",
  "Lato",
  "Maven+Pro",
  "Molengo",
  "Muli",
  "News+Cycle",
  "Open+Sans",
  "PT+Sans",
  "PT+Sans+Narrow",
  "PT+Serif",
  "Quattrocento",
  "Quattrocento+Sans",
  "Roboto",
  "Ubuntu",
  "Yeseva+One",
];

// adds the font names to each of the dropdowns
function initFontSelector() {
  font_options_html = "";
  $.each(google_fonts, function(index, font_name) {
    var friendly_font_name = font_name.replace(/\+/g, ' ');
    font_options_html += "<div class='option'>" + friendly_font_name + "</div>";
  });
  $(".font_options").html(font_options_html);
}
