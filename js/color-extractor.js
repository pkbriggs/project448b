
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

function deleteOldElement(class_name, is_image) {
  // delete existing element if it exists
    var old_element = $("." + class_name);
    if(old_element[0] !== undefined) {
      if(is_image) {
        old_element[0].remove();
      } else {
        old_element.empty().remove();
      }
    }
}

function loadAndRenderUploadedImage(image, callback) {
  // generate a new FileReader object
  var reader = new FileReader();

  // inject an image with the src url
  reader.onload = function(event) {
    var image_url = event.target.result;

    // delete existing image if it exists
    deleteOldElement("uploaded_image_preview", true);

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

function getCorrectNumColors(colorPalette) {
  var result = [];
  // iterate over the colors abstracted from the image and add them to an array
  // until we don't need any more colors.
  for(var i = 0; i < colorPalette.length; i++) {
    if(i > num_chart_colors) break;
    var curColorArray = colorPalette[i];
    var rgbColor = "rgb(" + curColorArray[0] + ", " + curColorArray[1] + "," + curColorArray[2] + ")";
    result.push(rgbColor);
  }
  return result;
}

// function that runs through the new colors and updates the 
function updateColorControls(new_colors) {

} 

function getColorsFromImage(image) {

  // get the dominant color from the image and update the dominant color div (to show the user)
  var dominantColor = getDominantColorFromImage(image);
  dominantColor = "rgb(" + dominantColor[0] + ", " + dominantColor[1] + "," + dominantColor[2] + ")";
  $(".image_dominant_color").css("background-color", dominantColor);

  // delete existing color blocks container if it exists
  deleteOldElement("image_color_palette_color", false);

  // get the color palette from the image and add a div for each color (to show the user)
  var colorPalette = getColorPaletteFromImage(image);
  $.each(colorPalette, function(index, color) {
    var colorBlock = document.createElement("div");
    colorBlock.className = "image_color_palette_color";
    colorBlock.style.backgroundColor = "rgb(" + color[0] + ", " + color[1] + "," + color[2] + ")";
    $(".image_color_palette_container")[0].appendChild(colorBlock);
  });

  // use colors taken from graph to color lines/bars on the graph
  var new_colors = getCorrectNumColors(colorPalette);
  setColorScale(color_scale.domain(), new_colors);
  updateChartConfigValue("change_color_scale", "", "", false);
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

// initialize the "choose file" input field
function initImageFilePicker() {
  $(".image_file_picker").change(function() {
    // this.files contains an array of the "uploaded" files
    // grab the first image in the FileList object and load/render it. when this is complete, it gets the colors from the image
    loadAndRenderUploadedImage(this.files[0], getColorsFromImage);
  });
}

function initImageDropZone() {
  var dropZone = $(".image_drag_and_drop_zone")[0];
  dropZone.addEventListener('dragenter', handleDragEnter, false);
  dropZone.addEventListener('dragleave', handleDragLeave, false);
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}


$(document).ready(function() {
  initImageFilePicker();
  initImageDropZone();
});