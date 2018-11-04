// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 150,
    left: 120
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);

    return xLinearScale;
}

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.9, 
      d3.max(data, d => d[chosenYAxis]) * 1.1]) 
      .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// function renderXYCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]))
//     .attr("cy", d => newYScale(d[chosenYAxis]));
//   return circlesGroup;
// }
function renderXYCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("transform", function(d) { return "translate(" + newXScale(d[chosenXAxis]) + "," + newYScale(d[chosenYAxis]) + ")"; });
  return circlesGroup;
}


function upperCasefirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var percent = ""
    if (chosenXAxis === "poverty")
      percent = "%";

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([40, -65])
      .html(function(d) {
        return (`${d.state}<br>${upperCasefirst(chosenXAxis)}: ${d[chosenXAxis]} ${percent}<br>${upperCasefirst(chosenYAxis)}: ${d[chosenYAxis]} %`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
      });
  
    return circlesGroup;
}

var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    throw error;
}


function successHandle(dataSet) {

    console.log(dataSet);

    //get numeric object properties that need to be parse
    var intProperties = []
    Object.entries(dataSet[0]).forEach(element => {
            var value = element[1]
            if(!isNaN(value))
            {
                intProperties.push(element[0]);
            }
        }
    );

    // parse data
    dataSet.forEach(function(data) {
        intProperties.forEach(property => { data[property] = +data[property]; })
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(dataSet, chosenXAxis);
    
    // Create y scale function
    var yLinearScale = yScale(dataSet, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g").call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(dataSet)
      .enter()
      .append("g")
      .classed("tick",  true)
      .attr("transform", function(d) { return "translate(" + xLinearScale(d[chosenXAxis]) + "," + yLinearScale(d[chosenYAxis]) + ")"; })
      
      circlesGroup.append("circle")
      .classed("stateCircle", true)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 10)
      .attr("opacity", 0.9);
      
      circlesGroup.append("text")
      .attr("dy", 3)
      .classed("stateText", true).text(d => d.abbr)

    // Create group for N x- axis labels
     var labelsGroup = chartGroup.append("g")
       .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Media)");
    
    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
  
    // Create group for N y- axis labels
    var labelsYGroup = chartGroup.append("g")
    .attr("transform", `translate(0, 0)`);

    var noHealthLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left + 65)
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks HealthCare (%)");
  
    var smokeLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 40)
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
    
    var obesityLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 15)
      .attr("dy", "1em")
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(dataSet, chosenXAxis);
  
          // updates x axis with transition
           xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderXYCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
            setActiveLabel(povertyLabel, chosenXAxis === "poverty")
            setActiveLabel(ageLabel, chosenXAxis === "age")
            setActiveLabel(incomeLabel, chosenXAxis === "income")
        }
      });

      // y axis labels event listener
    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(dataSet, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderXYCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          setActiveLabel(noHealthLabel, chosenYAxis === "healthcare")
          setActiveLabel(smokeLabel, chosenYAxis === "smokes")
          setActiveLabel(obesityLabel, chosenYAxis === "obesity")
      }
    });
}

function setActiveLabel(label, value){
    label
        .classed("active", value)
        .classed("inactive", !value);
}