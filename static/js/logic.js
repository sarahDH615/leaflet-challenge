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
    // add map layer
    var myMap = L.map('mapid', {
        center: [
            49.2827, -123.1207
        ],
        zoom: 4
      });

    // add tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);

    // add circles for each earthquake point
    earthquakeData.forEach(function(feature) {
        var coords = feature.geometry.coordinates;
        var mag = feature.properties.mag;
        var place = feature.properties.place;
        var time = feature.properties.time;
        var url = feature.properties.url
        var depth = coords[2];
        L.circle([coords[1], coords[0]], {
            color: "black",
            weight: 1,
            fillColor: colourCreator(depth),
            fillOpacity: 0.75,
            radius: makeRadius(mag),
        }).bindPopup(
            "<h3>Earthquake at " + Date(time) + "</h3><hr><h3>Located " + place + "</h3><nl><h3>Magnitude: " + mag + "</h3><nl><h3><a target='_blank' rel='noopener noreferrer' href='" + url + "'</a>Learn More</h3>"
        )
        .addTo(myMap);  
    });
    // adding legend
    var legend_dict = {             
        '-10 - 10': '#00ffbf',
        '10 - 30': '#00ffff',
        '30 - 50': '#00bfff',
        '50 - 70': '#0080ff',
        '70 - 90': '#0040ff',
        '90+': '#4000ff'
    };
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function(myMap) { 
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
        Object.keys(legend_dict).forEach(k => {
            return div.innerHTML += `<i style="background: ${legend_dict[k]}"></i><span>${k}</span><br>`;
        });
        
        return div;
      };
      
      legend.addTo(myMap);
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
});