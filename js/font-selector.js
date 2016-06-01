var font_link_base = "https://fonts.googleapis.com/css?family=";
var google_fonts = [
  "Aclonica",
  "Allan",
  "Annie+Use+Your+Telescope",
  "Anonymous+Pro",
  "Allerta+Stencil",
  "Allerta",
  "Amaranth",
  "Anton",
  "Architects+Daughter",
  "Arimo",
  "Artifika",
  "Arvo",
  "Asset",
  "Astloch",
  "Bangers",
  "Bentham",
  "Bevan",
  "Bigshot+One",
  "Bowlby+One",
  "Bowlby+One+SC",
  "Brawler",
  "Buda:300",
  "Cabin",
  "Calligraffitti",
  "Candal",
  "Cantarell",
  "Cardo",
  "Carter One",
  "Caudex",
  "Cedarville+Cursive",
  "Cherry+Cream+Soda",
  "Chewy",
  "Coda",
  "Coming+Soon",
  "Copse",
  "Corben:700",
  "Cousine",
  "Covered+By+Your+Grace",
  "Crafty+Girls",
  "Crimson+Text",
  "Crushed",
  "Cuprum",
  "Damion",
  "Dancing+Script",
  "Dawning+of+a+New+Day",
  "Didact+Gothic",
  "Droid+Sans",
  "Droid+Sans+Mono",
  "Droid+Serif",
  "EB+Garamond",
  "Expletus+Sans",
  "Fontdiner+Swanky",
  "Forum",
  "Francois+One",
  "Geo",
  "Give+You+Glory",
  "Goblin+One",
  "Goudy+Bookletter+1911",
  "Gravitas+One",
  "Gruppo",
  "Hammersmith+One",
  "Holtwood+One+SC",
  "Homemade+Apple",
  "Inconsolata",
  "Indie+Flower",
  "IM+Fell+DW+Pica",
  "IM+Fell+DW+Pica+SC",
  "IM+Fell+Double+Pica",
  "IM+Fell+Double+Pica+SC",
  "IM+Fell+English",
  "IM+Fell+English+SC",
  "IM+Fell+French+Canon",
  "IM+Fell+French+Canon+SC",
  "IM+Fell+Great+Primer",
  "IM+Fell+Great+Primer+SC",
  "Irish+Grover",
  "Irish+Growler",
  "Istok+Web",
  "Josefin+Sans",
  "Josefin+Slab",
  "Judson",
  "Jura",
  "Jura:500",
  "Jura:600",
  "Just+Another+Hand",
  "Just+Me+Again+Down+Here",
  "Kameron",
  "Kenia",
  "Kranky",
  "Kreon",
  "Kristi",
  "La+Belle+Aurore",
  "Lato:100",
  "Lato:100italic",
  "Lato:300",
  "Lato",
  "Lato:bold",
  "Lato:900",
  "League+Script",
  "Lekton",
  "Limelight",
  "Lobster",
  "Lobster Two",
  "Lora",
  "Love+Ya+Like+A+Sister",
  "Loved+by+the+King",
  "Luckiest+Guy",
  "Maiden+Orange",
  "Mako",
  "Maven+Pro",
  "Maven+Pro:500",
  "Maven+Pro:700",
  "Maven+Pro:900",
  "Meddon",
  "MedievalSharp",
  "Megrim",
  "Merriweather",
  "Metrophobic",
  "Michroma",
  "Miltonian Tattoo",
  "Miltonian",
  "Modern Antiqua",
  "Monofett",
  "Molengo",
  "Mountains of Christmas",
  "Muli:300",
  "Muli",
  "Neucha",
  "Neuton",
  "News+Cycle",
  "Nixie+One",
  "Nobile",
  "Nova+Cut",
  "Nova+Flat",
  "Nova+Mono",
  "Nova+Oval",
  "Nova+Round",
  "Nova+Script",
  "Nova+Slim",
  "Nova+Square",
  "Nunito:light",
  "Nunito",
  "OFL+Sorts+Mill+Goudy+TT",
  "Old+Standard+TT",
  "Open+Sans:300",
  "Open+Sans",
  "Open+Sans:600",
  "Open+Sans:800",
  "Open+Sans+Condensed:300",
  "Orbitron",
  "Orbitron:500",
  "Orbitron:700",
  "Orbitron:900",
  "Oswald",
  "Over+the+Rainbow",
  "Reenie+Beanie",
  "Pacifico",
  "Patrick+Hand",
  "Paytone+One",
  "Permanent+Marker",
  "Philosopher",
  "Play",
  "Playfair+Display",
  "Podkova",
  "PT+Sans",
  "PT+Sans+Narrow",
  "PT+Sans+Narrow:regular,bold",
  "PT+Serif",
  "PT+Serif Caption",
  "Puritan",
  "Quattrocento",
  "Quattrocento+Sans",
  "Radley",
  "Raleway:100",
  "Redressed",
  "Rock+Salt",
  "Rokkitt",
  "Roboto",
  "Ruslan+Display",
  "Schoolbell",
  "Shadows+Into+Light",
  "Shanti",
  "Sigmar+One",
  "Six+Caps",
  "Slackey",
  "Smythe",
  "Sniglet:800",
  "Special+Elite",
  "Stardos+Stencil",
  "Sue+Ellen+Francisco",
  "Sunshiney",
  "Swanky+and+Moo+Moo",
  "Syncopate",
  "Tangerine",
  "Tenor+Sans",
  "Terminal+Dosis+Light",
  "The+Girl+Next+Door",
  "Tinos",
  "Ubuntu",
  "Ultra",
  "Unkempt",
  "UnifrakturCook:bold",
  "UnifrakturMaguntia",
  "Varela",
  "Varela Round",
  "Vibur",
  "Vollkorn",
  "VT323",
  "Waiting+for+the+Sunrise",
  "Wallpoet",
  "Walter+Turncoat",
  "Wire+One",
  "Yanone+Kaffeesatz",
  "Yanone+Kaffeesatz:300",
  "Yanone+Kaffeesatz:400",
  "Yanone+Kaffeesatz:700",
  "Yeseva+One",
  "Zeyada"
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

// given a human friendly font name, loads the respective google font
function loadFont(human_font_name) {
  font_name = human_font_name.replace(/\ /g, '\+'); // replace spaces in name with +
  var font_link = font_link_base + font_name;
  if ($("link[href*='" + font_link + "']").length === 0) {
    $('link:last').after('<link href="' + font_link + '" rel="stylesheet" type="text/css">');
  }
}