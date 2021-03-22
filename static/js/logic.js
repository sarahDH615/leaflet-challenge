// processing functions
// r size
function makeRadius(magnitude) {
    return magnitude * 10000;
}
// circle colour
function colourCreator(depth) {
    if (depth < 10 ) {
        return '#00ffbf'
    } else if (depth < 30) {
        return '#00ffff'
    } else if (depth < 50) {
        return '#00bfff'
    } else if (depth < 70) {
        return '#0080ff'
    } else if (depth < 90) {
        return '#0040ff'
    } else {return '#4000ff'}
}
// map creation
// centred round Western Canada since many earthquakes seemed to occur there
function createMap(earthquakeData) {
    // var depths = earthquakeData.map(feature => feature.geometry.coordinates[2]);
    // var min_depth = d3.min(depths);
    // var max_depth = d3.max(depths);
    // console.log(min_depth);
    // console.log(max_depth);

    var myMap = L.map('mapid', {
        center: [
            49.2827, -123.1207
        ],
        zoom: 4
      });

    // Add a tile layer (the background map image) to our map
    // Use the addTo method to add objects to our map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);

    earthquakeData.forEach(function(feature) {
        var coords = feature.geometry.coordinates;
        var mag = feature.properties.mag;
        var place = feature.properties.place;
        var depth = coords[2];
        L.circle([coords[1], coords[0]], {
            color: "black",
            weight: 1,
            fillColor: colourCreator(depth),
            fillOpacity: 0.75,
            radius: makeRadius(mag),
          }).bindPopup("<h1>Place: " + place + "</h1> <hr> <h3>Magnitude: " + mag + "</h3>")
          .addTo(myMap);  
    });

};


// reading in data
var path = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson'

d3.json(path, function(data) {
    // console.log(data);
    var features = data.features;
    createMap(features);
    // console.log(features);
    // metadata components: features.properties
    // useful ones mag, place, alert?, time (needs conversion to human time), url (links to other maps by usgs)
    //var mags = features.map(feature => feature.properties.mag);
    //console.log(mags);
    // coordinates: lat, lng, depth
    // var coords = features.map(feature => feature.geometry.coordinates);
    // var depths = coords.map(coord => coord[2]);
    // var min_depth = d3.min(depths);
    // var max_depth = d3.max(depths);
    // console.log(min_depth);
    // console.log(max_depth);
});
