function setupChartData(chart_type) {
  // Function containing hard coded data examples
  if(chart_type === "bar") {
    var chart_data = [
      {
        "value": 40,
        "label": "Basketball"
      },
      {
        "value": 60,
        "label": "Baseball"
      },
      {
        "value": 28,
        "label": "Football"
      },
      {
        "value": 70,
        "label": "Soccer"
      },
      {
        "value": 15,
        "label": "Hockey"
      }
    ];
    setColorScale([0, 1, 2, 3, 4], ["#333", "#333", "#333", "#333", "#333"]);
    num_chart_colors = 5;
    chart_config["axis"]["x_label"] = "Favorite Sport";
    chart_config["axis"]["y_label"] = "Number of Students";
  } else {
    var chart_data = [
      {
        "label": "January",
        "val_one": 3.03, // Washington D.C.
        "val_two": 4.49, // SF
        "val_three": 0.55, // Las Vegas
        "val_four": 5.12, // New Orleans
        "val_five": 0.75 // Anchorage, AK
      },
      {
        "label": "February",
        "val_one": 2.48,
        "val_two": 4.45,
        "val_three": 0.75,
        "val_four": 5.28,
        "val_five": 0.71
      },
      {
        "label": "March",
        "val_one": 3.23,
        "val_two": 3.27,
        "val_three": 0.43,
        "val_four": 4.49,
        "val_five": 0.59
      },
      {
        "label": "April",
        "val_one": 3.15,
        "val_two": 1.46,
        "val_three": 0.16,
        "val_four": 4.57,
        "val_five": 0.47
      },
      {
        "label": "May",
        "val_one": 4.13,
        "val_two": 0.71,
        "val_three": 0.12,
        "val_four": 4.57,
        "val_five": 0.71
      }
    ];
    setColorScale(["val_one", "val_two", "val_three", "val_four"], ["#333", "#333", "#333", "#333", "#333"]);
    num_chart_colors = 4;
    chart_config["axis"]["x_label"] = "City";
    chart_config["axis"]["y_label"] = "Average Rainfall (in inches)";
  }

  return chart_data;
}
