// This file contains the structure and functionality of the apps Map.


// We have created flask routes within the app that contain useful info from the Database
// The 3 variables below are assigned the string urls of these routes
var url = 'http://localhost:5000/api/coordinates';
var url_stats = "http://localhost:5000/api/station_stats/";
var url_hours = "http://localhost:5000/api/station_stats/hourly_avgs/";


// init Map function creates map . All code is contained in this function so as to have access to the map variable
function initMap() {

    var dublin = {      //create the center point of map upon loading
        lat: 53.3498,
        lng: -6.2603
    };

    var map = new google.maps.Map(			// the following lines set the structure and functions/options of the map
        document.getElementById('map'), {   // <- This line simply places the map within the 'map' div of the HTML Template
            zoom: 13,
            center: dublin,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            //Following booleans get rid of many of the map buttons
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            //Following styles using array in mapStyle.js
            styles: mapStyle
        });


    // The below fetch function is used to fetch data from the url assigned above. 
    // We want to be able to fetch station information when the user clicks on a station marker (marker function defined later)
    fetch(url, map)
        .then(response => response.json())
        .then(function (data) {
        	
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],   // these coords define the clickable area of the markers
                type: 'poly' // poly = ploygon (clickable area is determined by above coords, and is not a circle/square etc
            };

            // Below we use 3 different colour markers, provided by google
            var image1 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/green.png'
            };
            var image2 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/orange.png'
            };
            var image3 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/red.png'
            };
            var image_array = [image1, image2, image3]; // Colour will be decided based on the index of this array.

            
            // Initialise variables that will be populated with for loop
            var bikes_at_station = {}; //this dictionary makes it easier to search for the number of bikes at any station
            var markerList = [];   //marker list to contain all markers made so that they can be accessed easily.
            var coord_len = data.coordinates.length; // This range allows one marker for every station.
            
            // For loop creates all the markers using coordinates from the url fetched.
            for (i = 0; i < coord_len; i++) {
                var num_bikes = data.coordinates[i].bikes;           //num_bikes = The number of available bikes at the station
                var img_dex = num_bikes <= 10 ? (num_bikes <= 5 ? 2 : 1) : 0;  // Determining of which colour to use for marker
                bikes_at_station[data.coordinates[i].num] = num_bikes; // Populate the dictionary with key:value pairs

                marker = new google.maps.Marker({ //Here the characteristics of the markers are input.
                    position: new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng),
                    map: map,
                    icon: image_array[img_dex],
                    shape: shape,
                    title: data.coordinates[i].name,
                    visible: false
                });
                markerList.push(marker)


                //////// Code for marker click function starts here ////////

                ///Needed for both versions of hourly_avg graphs
                var markName;

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {

                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes + "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands + "<br> <button id='daily_avg'> Hourly Averages </button> <br> <button id='prediction'>Get Prediction</button>");
                        infowindow.open(map, marker);

                        markName = marker.title;

                        //Use of jquery here to select daily_avg button when it loads
                        $(document).on('click','#daily_avg',function(){
                            //Need to get the station number from 
                            for (var i =0; i < data.coordinates.length; i++){
                                if (markName == data.coordinates[i].name){
                                    var stationNum = data.coordinates[i].num;
                                }
                            }
                            //Need to get the day of the week, using fuction in charts.js
                            getDay();

                            //Fetch the data from url and make chart, functions in charts.js
                            // NB - showLoader is used to show the user that something is happening - it is found in charts.js
                            showLoader()
                            fetch(url_hours + stationNum + "/" + day)
                                .then(response => response.json())
                                .then(function (stat_hourly_avgs){
                                    //hourlyChart in charts.js
                                    hourlyChart(stat_hourly_avgs.hourly_avgs, markName);
                                    hideLoader()
                                })
                        })

                        //Form display and information passing
                        $(document).on('click','#prediction',function(){
                            //Need to get the station number from marker
                            for (var i =0; i < data.coordinates.length; i++){
                                if (markName == data.coordinates[i].name){
                                    var stationNum = data.coordinates[i].num;
                                }
                            }
                            showForm(markName, stationNum);  
                        });

                        //Code used to display chart when marker is clicked, functions in charts.js
                        showLoader();
                        fetch(url_stats + "daily_avgs/" + data.coordinates[i].num)
                            .then(response => response.json())
                            .then(function (stat_daily_avgs) {
                                //dailyChart in charts.js
                                dailyChart(stat_daily_avgs, data.coordinates[i].name);
                                hideLoader();
                            });
                    }
                })(marker, i));   //////// Code for marker click function end here  ////////
            } ///// Marker creation for loop ends here
            
            

            //////// Code for map circles starts here ///////

            //The below code determines circle colour based on the average availability in the circle
            //NB - circles coming from mapStyle.js
            var circle_colour = {};
            for (circle in circles) {
                var avg_bikes_at_station = 0;
                for (var i in circles[circle].stations) {  //get the stations that each circle represents
                	// using the bikes_at_staion dictionary, we sum the available bikes of each station
                    avg_bikes_at_station = avg_bikes_at_station + bikes_at_station[circles[circle].stations[i]];
                }
                // Then we divide that sum by the number of stations to get the real average
                avg_bikes_at_station = avg_bikes_at_station / circles[circle].stations.length; 

                // Determine the colour of the circles depending on the average number of bikes available
                if (avg_bikes_at_station <= 5) {
                    circle_colour[circle] = "red";
                } else if (avg_bikes_at_station <= 10) {
                    circle_colour[circle] = "orange";
                } else {
                    circle_colour[circle] = "green";
                }
            }


            // Add for loop to create circles in Map. This is based off of googles suggested code "..google.com/maps/documentation"
            var circleList = [] //create circleList array so circle objects can be accessed easily if necessary
            for (var circle in circles) {
                // Add the circle for this city to the map.
                var occupancyCircle = new google.maps.Circle({
                    //the below code decides the appearance and location of each circle based on information in the circles object above
                    strokeColor: circle_colour[circle],
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: circle_colour[circle],
                    fillOpacity: 0.25,
                    map: map,
                    center: circles[circle].center,
                    radius: circles[circle].size
                });
                circleList.push(occupancyCircle); 


                //add event listener for circle click (if click on circle: zoom into that circle to show markers)
                google.maps.event.addListener(occupancyCircle, "click", function (circles, circle) {
                    return function () {
                        var latLngCircle = new google.maps.LatLng(circles[circle].center); //get center of circle from circles
                        map.panTo(latLngCircle);
                        map.setZoom(15);
                    }
                }(circles, circle)) //end of event listener
            }

            
            //add event listener for zoom event
            google.maps.event.addListener(map, "zoom_changed", function () {
                var currentZoom = map.getZoom();
                // if zoom is less than 15 show only circles, else show only markers. This means only circles show on page load.
                if (currentZoom < 15) {
                    for (var i in markerList) {
                        markerList[i].setVisible(false);
                    }
                    for (var i in circleList) {
                        circleList[i].setVisible(true);
                    }
                } else {
                    for (var i in markerList) {
                        markerList[i].setVisible(true);
                    }
                    for (var i in circleList) {
                        circleList[i].setVisible(false);
                    }
                }
            })
                                
            //////// Code for map circles functionality ends here ////////

            //////// Code for search bar functionality begins here ////////

            const inputBox = document.getElementById('stationtextbox'); // Here we get user search input from HTML

            //Using the info data given by user, this function pans out and then zooms into selected station
            function findStation() {
                var station = inputBox.value;
                for (i = 0; i < markerList.length; i++) {
                    if (station == markerList[i].title) {
                        var latLng = new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng);
                        //zoom out
                        map.setZoom(15);
                        //Move to location searched
                        map.panTo(latLng);
                        //Set content window
                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes + "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands + "<br> <button id='daily_avg'> Daily Average </button> <br> <button id='prediction'>Get Prediction</button>");
                        //Open content window
                        infowindow.open(map, markerList[i]);
                        //Time out creates a slower zooming effect, less jumpy
                        setTimeout(function () { 
                            //Zoom in
                            map.setZoom(17);
                        }, 1000);


                        //Variable has previously been declared in the marker click section
                        markName = markerList[i].title;
                        // The below code is for showing station statistics when the user uses search bar

                        $(document).on('click','#daily_avg',function(){
                            //Need to get the station number from marker
                            for (var i =0; i < data.coordinates.length; i++){
                                if (markName == data.coordinates[i].name){
                                    var stationNum = data.coordinates[i].num;
                                }
                            }
                            
                            //Need to get the day of the week, function in charts.js
                            getDay()
                            
                            //Fetch the data from url and make chart, functions in charts.js
                            showLoader()
                            fetch(url_hours + stationNum + "/" + day)
                                .then(response => response.json())
                                .then(function (stat_hourly_avgs){
                                    //hourlyChart in charts.js
                                    hourlyChart(stat_hourly_avgs.hourly_avgs, markName);
                                    hideLoader()
                                })
                        });


                        //Form display and information passing, most of form code in form.js
                        $(document).on('click','#prediction',function(){
                            //Need to get the station number from marker
                            for (var i =0; i < data.coordinates.length; i++){
                                if (markName == data.coordinates[i].name){
                                    var stationNum = data.coordinates[i].num;
                                }
                            }
                            showForm(markName, stationNum);
                           
                        });



                        //Below is relevant for creating the graph when using search bar, functions in charts.js
                        showLoader();
                        var stationName = data.coordinates[i].name;
                        fetch(url_stats + "daily_avgs/" + data.coordinates[i].num)
                            .then(response => response.json())
                            .then(function (stat_daily_avgs) {
                                dailyChart(stat_daily_avgs, stationName);
                                hideLoader();
                            })
                    }
                }
            }

            //Allows input box to be executed with enter key
            inputBox.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    findStation();
                }
            });

            //////// Code for search bar functionality ends here ////////


        });
}


