//define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

//define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//select id "scatter", append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append a group to the SVG area and shift ('translate') it to the right & down to adhere to the margins set in the "margin" object
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv("assets/data/data.csv").then(function(data_journalism) {

    console.log(data_journalism);
    
    //parse data/cast as numbers
    data_journalism.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(data_journalism, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(data_journalism, d => d.healthcare)])
    .range([height, 0]);

    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //create circles and text - we will do this by grouping them together
    //reference: https://stackoverflow.com/questions/26955267/adding-text-to-a-circle-in-d3
    var circles = chartGroup.selectAll("circle")

    circles = circles.data(data_journalism)
        .enter()
        .append("g")

    circles.append("circle")

    circles.selectAll("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("stroke", "white")
        .attr("fill", "#0093bb")
        .attr("opacity", ".9")
    
    circles.append("text");

    circles.selectAll("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("fill", "black")
        .attr("font-size", "8")
        .attr("text-anchor",  "middle")
        .attr("alignment-baseline", "middle")

    //create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2 + 60))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .attr("font-weight", "bold");
    
    chartGroup.append("text")
    .attr("transform", `translate(${width / 3 + 80}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)")
    .attr("font-weight", "bold");

}).catch(function(error) {
    console.log(error);
});
