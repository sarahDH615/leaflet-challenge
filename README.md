## leaflet-challenge

### contains
- Leaflet-Step-1
    - static
        - css
            - style.css
        - js
            - logic.js
    - index.html
- Leaflet-Step-2
    - static
        - css
            - style.css
        - js
            - logic.js
        - data
            - PB2002_boundaries.json
    - index.html

### description

This project's goal was to present data from the USGS (United States Geological Survey) on global earthquakes greater than magnitude 1, over the last 30 days from 22 March 2021. The representation would be done twice: once as circle markers over a Mapbox street map (step 1), and the second time as circle markers over a choice of Mapbox maps, alongside tectonic plate data (step 2). 
The following steps were taken to achieve these displays:
- Step 1: Earthquake Visualisation
    - read in data using d3.json()
    - plot each earthquake as a circle marker over a street map
        - process the data for mapping
            - make radius size of circles dependant on earthquake magnitude
                - create a function, makeRadius(), to return the magnitude times 10,000 to make the magnitudes visible on the map
            - make colour of the circles dependant on the depth of the earthquake
                - create a function, colourCreator(), which returns a specified colour depending on the earthquake depth
        - create a function createMap() to plot the circles on the Mapbox map, which:
            - obtains the underlying map from Mapbox
            - conducts a for loop on each point in the earthquake data, extracts coordinates, magnitude, depth, and time, amongst other information, and uses makeRadius() and colourCreator() to append a circle, and bind a popup containing the point information
            - adds a legend containing the colour and depth range for each depth category
- Step 2: Earthquake and Tectonic Plate Visualisations
    - read in earthquake and tectonic using two nested d3.json() calls
    - plot each earthquake as a circle marker, and plates as lines, over a choice of street, dark, or satellite maps
        - process the data for mapping
            - make radius size of circles dependant on earthquake magnitude
                - create a function, makeRadius(), to return the magnitude times 2 to make the magnitudes visible on the map
            - make colour of the circles dependant on the depth of the earthquake
                - create a function, colourCreator(), which returns a specified colour depending on the earthquake depth
        - create geoJSON layers for the earthquake and plate data
            - create a function, createFeatures(), which:
                - extracts the coordinates from the plate data, apply styling to it and add to a geoJSON layer, named plates
                - uses the functions pointToLayer and onEachFeature() return a CircleMarker for, and to bind a popup to each earthquake datapoint
                - adds those CircleMarkers to a geoJSON layer, named earthquakes
        - create a function createMap() to plot the circles and lines on the Mapbox map, which:
            - obtains three underlying maps from Mapbox
            - creates baseMaps and overlayMaps objects containing the two categories of layers (maps and data layers), adds them to the map, and designates default maps to show
            - adds a legend containing the colour and depth range for each depth category
            - adds a control layer that allows for showing/hiding the data layers
### challenges
- different radius scales
- reading in two data sets at once