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
    .domain([0, d3.max(data_journalism, d => d.healthcare)])
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

    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data_journalism)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("stroke", "white")
    .attr("fill", "#0093bb")
    .attr("opacity", ".9")
    
    circlesGroup.append("text");

    circlesGroup.selectAll("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("fill", "black")
        .attr("font-size", "3px")
        .attr("text-anchor",  "middle")
    
    //~~~
    // var abbr = chartGroup.selectAll("text")
    // .data(data_journalism)
    // .enter()
    // .append("text")

    // var abbr_text = text
    // .text(d => d.abbr)
    // .attr("x", d => xLinearScale(d.poverty))
    // .attr("y", d => yLinearScale(d.healthcare))
    // //.text(d => d.abbr)
    // .attr("fill", "black")
    // .attr("font-size", "3px")
    // .attr("text-anchor",  "middle")

    //~~~

    //add state abbr to each circle
    // circlesGroup.append("text")
    //   .attr("dx", d => xLinearScale(d.poverty))
    //   .attr("dy", d => yLinearScale(d.healthcare))
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .style('font-size', 5)
    //   .style("fill", "black")
    //   .text(d => d.abbr)
    
    //create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
    
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty(%)");

}).catch(function(error) {
    console.log(error);
});
