// Store queryUrl for pas day and past 7 days : 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  //send the data.features object to the createFeatures function
  createFeatures(data.features);
});
//  define function to get color for each Magnitudes:
function getColor(x) {
  return x > 5 ? "#f40202" :
         x > 4 ? "#f45f02" :
         x > 3 ? "#f49702" :
         x > 2 ? "#F4bc02" :
         x > 1 ? "#d8f402" :
         x > 0 ? "#93f402" :
              "#FFEDA0";
}

// Define a function for each feature in the features array
function createFeatures(earthquakeData) {

  
  // Give each feature a popup describing the place and time  and Magnitudes of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + `Place: ${feature.properties.place}` +
      "</h3><h4>"+ ` Magnitudes: ${feature.properties.mag} ` +"</h4><hr><p>" + ` Date and Time:  ${new Date(feature.properties.time) }`+ "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function  and pointTolayer (base on Magnitudes) for markers once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {radius:feature.properties.mag * 4.5, fillOpacity: 0.85, color:"black", fillColor: getColor(feature.properties.mag), weight: 1,
      opacity: 1});
  },

    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define light map and Satellite Map layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  

  var SatelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Map": lightmap,
    "Satellite Map": SatelliteMap
  };

  // Create overlay object to hold our overlay layer base on earthquakes data
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // define legend :

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i  class="circle" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}







