// processing functions
// r size
function makeRadius(magnitude) {
    return magnitude * 2;
};
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
};


// reading in data
var path1 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';
var path2 = 'static/data/PB2002_boundaries.json'

d3.json(path1, function(error1, data1){
    d3.json(path2, function(error2, data2) {
        var tec_features = data2.features;
        var eq_features = data1.features;
        
        createFeatures(eq_features, tec_features);
    })
});


function createFeatures(earthquakeData, tectonicData) {
    // creating the plates layer
    // ---------------------------------------------------------
    // extracting the coordinates and types from the plate data
    var myLines = tectonicData.map(d => d.geometry);
    // defining the style of the lines
    var myStyle = {
        'color': 'orange',
        'weight': 5,
        'opacity': 0.75
    };
    // using myLines and myStyle to create a geoJSON obj
    var plates = L.geoJSON(myLines, {
        style:myStyle
    });

    // creating the circles layer
    // ---------------------------------------------------------
    // function for adding a popup to each circle with date, place, magnitude, depth, and link to usgs further info
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Earthquake at ${Date(feature.properties.time)}</h3><hr><h3>Located ${feature.properties.place}</h3><nl><h3>Magnitude: ${feature.properties.mag} ${feature.properties.magType}</h3><nl><h3>Depth: ${feature.geometry.coordinates[2]} km</h3><nl><h3><a target='_blank' rel='noopener noreferrer' href='${feature.properties.url}'</a>Learn More</h3>`);
    };

    // function that creates circles from each data point, dependant on magnitude and depth
    // also runs the on each feature function on each data point
    var earthquakes = L.geoJSON(earthquakeData, { 
        // creating circle size and colour marker
        pointToLayer: function(feature, latlng) {
            // defining radius size
            var rad = makeRadius(feature.properties.mag);
            // defining what colour will be applied
            var colourChoice = colourCreator(feature.geometry.coordinates[2]);

            return new L.CircleMarker(latlng, {
                radius: rad, 
                fillColor: colourChoice,
                fillOpacity: 0.75,
                color: 'black',
                weight: 1,
                opacity: 1
            });
        },
        // binding popup on each marker
        onEachFeature: onEachFeature
    });

    // sending layers to the createMap funct
    createMap(earthquakes, plates);
};

function createMap(earthquakes,plates) {

  // base layers
    // streetmap
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // darkmap
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // satellite
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    // baseMaps object to hold base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        'Satellite Map': satellitemap
    };

    // overlay object to hold overlay layer
    var overlayMaps = {
        'Earthquakes': earthquakes,
        'Tectonic Plates': plates
    };

    // create map, displaying streetmap and both overlays on load
    var myMap = L.map("mapid", {
        center: [
            49.2827, -123.1207
        ],
        zoom: 4,
        layers: [streetmap, plates, earthquakes]
    });

    // adding legend
    // dict of legend text
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
        // creating legend coloured circles and categs
        Object.keys(legend_dict).forEach(k => {
            return div.innerHTML += `<i style="background: ${legend_dict[k]}"></i><span>${k}</span><br>`;
        });

        return div;
    };
   
    legend.addTo(myMap);

    // layer control to flip between layers, not collapsable
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
