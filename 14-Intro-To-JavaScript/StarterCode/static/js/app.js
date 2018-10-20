// from data.js
var tableData = data;

// YOUR CODE HERE!

//Function to render table body base on an array
function create_data_table(sightings){
    var table_body = d3.select("#ufo-table").select("tbody");
    table_body.text("");
    sightings.forEach(sighting => {
        var row = table_body.append("tr") 
        row.append("td").text(sighting.datetime);
        row.append("td").text(sighting.city);
        row.append("td").text(sighting.state);
        row.append("td").text(sighting.country);
        row.append("td").text(sighting.shape);
        row.append("td").text(sighting.durationMinutes);
        row.append("td").text(sighting.country);
    });
}

//Function to render table body with single row to show a message 
function create_empty_table(message){
    var table_body = d3.select("#ufo-table").select("tbody");
    table_body.text("");
    table_body.append("tr")
        .append("td")
        .attr("colspan", "7")
        .attr("align", "center")
        .attr("class", "errormessage")
        .text(message);
}

//Fucntion to capitalize first letter on a string
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

//Listener for All button to display all the records 
d3.select("#all-btn").on("click", function(){
    d3.event.preventDefault();
    d3.select("#searchvalue").property("value", "");
    create_data_table(tableData);
})


//Listener for Search button based on Type Data and Value
d3.select("#filter-btn").on("click", function(){
    d3.event.preventDefault();
    var seachBy  = d3.select("#searchby").node().value
    var inputValue  = d3.select("#searchvalue").property("value");

    if(inputValue == ""){
        create_empty_table("Please enter a value for " + seachBy.capitalizeFirstLetter())
        return;
    }

    var filteredData = filterTable(seachBy, inputValue); 

    if(filteredData && filteredData.length >=1)
        create_data_table(filteredData);
    else
        create_empty_table("There is no records for " + seachBy.capitalizeFirstLetter() + " : " + inputValue)
});

//Fcuntion to filtered by different criteria 
function filterTable(seachBy, inputValue)
{
    var results = []
    switch(seachBy){
        case "datetime":
            results = tableData.filter(sighting => sighting.datetime === inputValue);
        break;
        case "city":
            results = tableData.filter(sighting => sighting.city.toLocaleLowerCase() === inputValue.toLocaleLowerCase());
            break;
        case "state":
            results = tableData.filter(sighting => sighting.state.toLocaleLowerCase() === inputValue.toLocaleLowerCase());   
            break;
        case "country":
            results = tableData.filter(sighting => sighting.country.toLocaleLowerCase() === inputValue.toLocaleLowerCase());
            break;
        case "shape":
            results = tableData.filter(sighting => sighting.shape.toLocaleLowerCase() === inputValue.toLocaleLowerCase());
            break;
        default:
    };
    return results;
}

//Listener for Search By Select 
d3.select("#searchby").on("change", function(){
    d3.event.preventDefault();
    var searchValueItem = d3.select("#searchvalue");
    d3.select("#searchvalue").property("value", "");
    switch(this.value){
        case "datetime":
            searchValueItem.attr("placeholder", "1/11/2011");
            break;
        case "city":
            searchValueItem.attr("placeholder", "Round Rock");
            break;
        case "state":
            searchValueItem.attr("placeholder", "TX");
            break;
        case "country":
            searchValueItem.attr("placeholder", "US");
            break;
        case "shape":
            searchValueItem.attr("placeholder", "light");
            break;
        default:
    };
});

//On Page Load
create_data_table(tableData);