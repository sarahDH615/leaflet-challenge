## leaflet-challenge

_Step 1_
![Step 1 Map](/images/step1Map.png)

_Step 2_
![Step 2 Map](/images/step2Map.png)

### contains
- Leaflet-Step-1
    - static
        - css
            - style.css: styling for the map
        - js
            - logic.js: JavaScript file for processing data and building the map
    - index.html: HTML page to display the visualisation
- Leaflet-Step-2
    - static
        - css
            - style.css: styling for the map
        - js
            - logic.js: JavaScript file for processing data and building the map
        - data
            - PB2002_boundaries.json: JSON file containing the tectonic plate location data
    - index.html: HTML page to display the visualisation

### description

This project's goal was to present data from the USGS (United States Geological Survey) on global earthquakes greater than magnitude 1, over the last 30 days from 22 March 2021. The representation would be done twice: once as circle markers over a Mapbox street map (step 1), and the second time as circle markers over a choice of Mapbox maps, alongside tectonic plate data (step 2). 
The following steps were taken to achieve these displays:
- Step 1: Earthquake Visualisation
    - read in data from a URL using d3.json()
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
    - read in earthquake and tectonic using two nested d3.json() calls, one to a URL, the other to a local file
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
### observations/challenges

One of the difficulties in this project was properly processing the original data for display. In step one, making the earthquake datapoints large enough to be visible required multiplication by 10,000. In step two, the same multiplication factor resulted in one datapoint circle filling the whole screen. This difference occurred because step one used L.circles() to make a circle layer, whilst step two used L.CircleMarker(). The first has a simpler procedure, but requires a slightly larger amount of preprocessing (the multiplication factor); this simpler procedure fits well with the simpler goal of one data layer on a map, and so was implemented in step one. The second method, L.CircleMarker(), works with pointToLayer and L.geoJSON(), and has a bit more complex syntax, but allows for circles that are visible without a multiplication factor (one was used here to make them just a bit more visible). It was used in step two because two geoJSON() layers were required.

Another challenging aspect was adjusting the code from step one to step two to read in two datasets at once. The two datasets (earthquake data and tectonic plate locations) had to be read in together so that they could be sent to the same functions together and be put on the same map. Initially Promise.all() was considered for doing this task, but eventually using nested calls to d3.json() were decided upon for its simpler syntax. 

Upon looking at the step two map, it can be seen that many of the earthquakes follow plate lines. This seems sensible, as shifts in plates would presumably cause tremours at plate edges. However, some other factors do seem to be at play. Plate edges alone do not explain why so many earthquakes were located off the western Canadian, western South American, and eastern Japanese coasts, as opposed to other coasts that lie along plate boundaries. Furthermore, there seems to be a cluster of earthquakes near Hawai'i, and one in the Artic, where there does not seem to be major tectonic plate edges. Finding and plotting these additional factors contributing to these earthquakes could be an interesting addition to this map. 