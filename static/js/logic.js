// reading in data
var path = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'

d3.json(path, function(data) {
    // console.log(data);
    var features = data.features;
    // console.log(features);
    // coordinates: lat, lng, depth
    var coords = features.map(feature => feature.geometry.coordinates);
    console.log(coords);
});