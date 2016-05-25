
var NUM_COLORS_IN_PALETTE = 5;


function getDominantColorFromImage(image) {
  var colorThief = new ColorThief();
  return colorThief.getColor(image);
}

function getColorPaletteFromImage(image, numColors) {
  numColors = numColors || NUM_COLORS_IN_PALETTE; // default to NUM_COLORS_IN_PALETTE colors in palette
  var colorThief = new ColorThief();
  return colorThief.getPalette(image, numColors);
}

function loadAndRenderUploadedImage(image, callback) {
  // generate a new FileReader object
  var reader = new FileReader();

  // inject an image with the src url
  reader.onload = function(event) {
    var image_url = event.target.result;

    // create an image with the source URL we got; call the callback when it is done loading
    var img = new Image();
    img.src = image_url;
    img.className = "uploaded_image_preview";
    $(img).on("load", function() {
      callback(img);
    });
    $(".image_picker_preview_container")[0].appendChild(img);
  }

  // when the file is read it triggers the onload event above.
  reader.readAsDataURL(image);
}

function getColorsFromImage(image) {
  // get the dominant color from the image and update the dominant color div (to show the user)
  var dominantColor = getDominantColorFromImage(image);
  $(".image_dominant_color").css("background-color", "rgb(" + dominantColor[0] + ", " + dominantColor[1] + "," + dominantColor[2] + ")");

  // get the color palette from the image and add a div for each color (to show the user)
  var colorPalette = getColorPaletteFromImage(image);
  $.each(colorPalette, function(index, color) {
    var colorBlock = document.createElement("div");
    colorBlock.className = "image_color_palette_color";
    colorBlock.style.backgroundColor = "rgb(" + color[0] + ", " + color[1] + "," + color[2] + ")";
    $(".image_color_palette_container")[0].appendChild(colorBlock);
  });
}

// when a user begins dragging something over the drag area
function handleDragEnter(evt) {
  $(".image_drag_and_drop_zone").addClass("drag_in_progress");
  $(".drag_and_drop_label").text("Drop away!");
}

// when the users stops dragging something over the drag area (without dropping)
function handleDragLeave(evt) {
  $(".image_drag_and_drop_zone").removeClass("drag_in_progress");
  $(".drag_and_drop_label").text("Drop an image here");
}

// called every time the user moves their cursor while dragging over the drop area
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy. prevents browser from redirecting to new page showing only the image
}


// when the user drops an image on the drop zone
function handleFileSelect(evt) {
  $(".image_drag_and_drop_zone").removeClass("drag_in_progress");
  $(".drag_and_drop_label").text("Got it!");

  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  loadAndRenderUploadedImage(files[0], getColorsFromImage);
}

function initImageFilePicker() {
  $(".image_file_picker").change(function() {
    // this.files contains an array of the "uploaded" files
    // grab the first image in the FileList object and load/render it. when this is complete, it gets the colors from the image
    loadAndRenderUploadedImage(this.files[0], getColorsFromImage);
  });

  var dropZone = $(".image_drag_and_drop_zone")[0];
  dropZone.addEventListener('dragenter', handleDragEnter, false);
  dropZone.addEventListener('dragleave', handleDragLeave, false);
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}



$(document).ready(function() {
  initImageFilePicker();
});