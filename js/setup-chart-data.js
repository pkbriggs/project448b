function setupChartData(chart_type) {
  // Function containing hard coded data examples
  if(chart_type === "bar") {
    var chart_data = [
      {
        "value": 40,
        "label": "fruits"
      },
      {
        "value": 60,
        "label": "vegetables"
      },
      {
        "value": 25,
        "label": 1966
      },
      {
        "value": 70,
        "label": "onomatopoeia"
      },
      {
        "value": 66,
        "label": "hi"
      }
    ];
    setColorScale([0, 1, 2, 3, 4], ["#333", "#333", "#333", "#333", "#333"]);
    num_chart_colors = 5;
  } else {
    var chart_data = [
      {
        "label": "January",
        "val_one": 40,
        "val_two": 13,
        "val_three": 70,
        "val_four": 6,
        "val_five": 60
      },
      {
        "label": "February",
        "val_one": 50,
        "val_two": 29,
        "val_three": 40,
        "val_four": 15,
        "val_five": 55
      },
      {
        "label": "March",
        "val_one": 15,
        "val_two": 40,
        "val_three": 50,
        "val_four": 5,
        "val_five": 58
      },
      {
        "label": "April",
        "val_one": 14,
        "val_two": 35,
        "val_three": 55,
        "val_four": 8,
        "val_five": 65
      },
      {
        "label": "May",
        "val_one": 70,
        "val_two": 60,
        "val_three": 15,
        "val_four": 5,
        "val_five": 83
      }
    ];
    setColorScale(["val_one", "val_two", "val_three", "val_four"], ["#333", "#333", "#333", "#333", "#333"]);
    num_chart_colors = 4;
  }

  return chart_data;
}
