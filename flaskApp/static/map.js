// Initialize and add the map
var url = 'http://localhost:5000/api/coordinates';
var url_stats = "http://localhost:5000/api/station_stats/";

function initMap(data) {	
	
    var dublin = {
        lat: 53.3498,
        lng: -6.2603
    };

    var map = new google.maps.Map(
        document.getElementById('map'), {
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
    
    
    fetch(url, map)
        .then(response => response.json())
        .then(function (data) {
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
            };


            var image1 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/green.png'
            };
            var image2 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/orange.png'
            };
            var image3 = {
                url: 'http://maps.google.com/mapfiles/ms/icons/red.png'
            };
            var image_array = [image1, image2, image3];

            var bikes_at_station = {}; //this dictionary makes it easier to search for the number of bikes at any station
            var markerList = [];
            var coord_len = data.coordinates.length;
            for (i = 0; i < coord_len; i++) {
                var num_bikes = data.coordinates[i].bikes;
                var img_dex = num_bikes <= 10 ? (num_bikes <= 5 ? 2 : 1) : 0;
                bikes_at_station[data.coordinates[i].num] = num_bikes;

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng),
                    map: map,
                    icon: image_array[img_dex],
                    shape: shape,
                    title: data.coordinates[i].name,
                    visible: false
                });
                markerList.push(marker)
                

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {

                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes +  "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands + "<br> <button> Daily Average </button> <br> <button>Get Prediction</button>" );
                        infowindow.open(map, marker);
                        fetch(url_stats + data.coordinates[i].num)
                            .then(response => response.json())
                            .then(function (stat_id) {
                                //alert(stat_id.avg);
                            });
                    }
                })(marker, i));
            }
            
            //The below code determines circle colour based on the average availability in the circle
            //circles coming from mapStyle.js
            var circle_colour = {};
            for (circle in circles){
            	var avg_bikes_at_station = 0;
            	for (var i in circles[circle].stations){
            		avg_bikes_at_station = avg_bikes_at_station + bikes_at_station[circles[circle].stations[i]];
            	}
            	avg_bikes_at_station = avg_bikes_at_station / circles[circle].stations.length;
            	
            	if (avg_bikes_at_station <= 5){
            		circle_colour[circle] = "red";
            	}
            	else if (avg_bikes_at_station <= 10){
            		circle_colour[circle] = "orange";
            	}
            	else {
            		circle_colour[circle] = "green";
            	}
            }
            
            
            // Add for loop to create circles in Map. This is based off of googles suggested code "..google.com/maps/documentation"
            var circleList = []
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
                }
            
            //add event listener for zoom event
            google.maps.event.addListener(map, "zoom_changed", function() {
                var currentZoom = map.getZoom();
                // if zoom is less than 15 show only circles, else show only markers
                if (currentZoom < 15) {
                	for (var i in markerList){
                		markerList[i].setVisible(false);
                	}
                	for (var i in circleList){
                		circleList[i].setVisible(true);
                	}
                }
                else{
                	for (var i in markerList){
                    	markerList[i].setVisible(true);
                    	}
                	for (var i in circleList){
                		circleList[i].setVisible(false);
                	}
                }
            })


            /* Code for search bar functionality begins here*/

            const inputBox = document.getElementById('stationtextbox');

            function findStation() {
                var station = inputBox.value;
                for (i = 0; i < markerList.length; i++) {
                    if (station == markerList[i].title) {
                        var latLng = new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng);
                        map.setZoom(13);
                        map.panTo(latLng);
                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes +  "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands + "<br> <button> Daily Average </button> <br> <button>Get Prediction</button>" );
                        infowindow.open(map, markerList[i]);
                        //Time out used to allow map to zoom out and back in smoothly on station search
                        setTimeout(function() {
                            map.setZoom(16);  
                        }, 1000);
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

            /* Code for search bar functionality ends here */
        });
}
