// Initialize and add the map
var url = 'http://localhost:5000/api/coordinates';
var url_stats = "http://localhost:5000/api/station_stats/";

function initMap(data) {	
	
	//below contains information about the circles. The circles should not show until less than x zoom
	//maybe this list should be stored in a separate file
	var circles = {
			heuston_south: {
				center: {lat: 53.341979, lng: -6.301860},
				size: 600,
				stations: [97,83,96,85,84,81,80,82,95],
			},
			heuston_north: {
				center: {lat: 53.347594, lng: -6.294095},
				size: 240,
				stations: [93,94,86,92,100],
			},
			liberties: {
				center: {lat: 53.343415, lng: -6.288256},
				size: 200,
				stations: [75,76],
			},
			ncad: {
				center: {lat: 53.343901, lng: -6.277697},
				size: 300,
				stations: [73,74,7,72],
			},
			smithfield: {
				center: {lat: 53.349532, lng: -6.282445},
				size: 310,
				stations: [87,88,42,50]
			},
			king_st: {
				center: {lat: 53.350305, lng: -6.273684},
				size: 100,
				stations: [101]
			},
			greek_st: {
				center: {lat: 53.346903, lng: -6.272976},
				size: 100,
				stations: [4]
			},
			temple_bar: {
				center: {lat: 53.344202, lng: -6.266997},
				size: 310,
				stations: [29,10,6,9]
			},
			stephens_green: {
				center: {lat: 53.338873, lng: -6.264765},
				size: 370,
				stations: [17,51,71,54,53,37,52]
			},
			iveagh_gardens: {
				center: {lat: 53.332794, lng: -6.262103},
				size: 330,
				stations: [18,55,11,41,5]
			},
			portobello: {
				center: {lat: 53.330332, lng: -6.266076},
				size: 200,
				stations: [43,34]
			},
			trinity: {
				center: {lat: 53.341944, lng: -6.256239},
				size: 180,
				stations: [27,98,21]
			},
			odonoughues: {
				center: {lat: 53.337520, lng: -6.252032},
				size: 300,
				stations: [36,26,113,89,13]
			},
			merrion_east: {
				center: {lat: 53.340355, lng: -6.243740},
				size: 300,
				stations: [63,25,57,56,58]
			},
			ballsbridge_north: {
				center: {lat: 53.334568, lng: -6.245914},
				size: 200,
				stations: [114,19,47]
			},
			leeson_st: {
				center: {lat: 53.332173, lng: -6.252946},
				size: 100,
				stations: [39]
			},
			grand_canal_dock: {
				center: {lat: 53.343417, lng: -6.235406},
				size: 370,
				stations: [69,91,68,90,117]
			},
			custom_house: {
				center: {lat: 53.347858, lng: -6.254458},
				size: 270,
				stations: [23,22,16]
			},
			famine_memorial: {
				center: {lat: 53.347105, lng: -6.245245},
				size: 270,
				stations: [8,48,99,64,62]
			},
			pearse_st: {
				center: {lat: 53.344338, lng: -6.250715},
				size: 100,
				stations: [32]
			},
			three_arena: {
				center: {lat: 53.347376, lng: -6.232889},
				size: 200,
				stations: [66,67]
			},
			north_wall: {
				center: {lat: 53.348388, lng: -6.239290},
				size: 150,
				stations: [65,49]
			},
			jervis: {
				center: {lat: 53.349826, lng: -6.267826},
				size: 300,
				stations: [3,31,77,40]
			},
			arran_quay: {
				center: {lat: 53.355971, lng: -6.278976},
				size: 200,
				stations: [105,103,104]
			},
			cabra: {
				center: {lat: 53.360089, lng: -6.278639},
				size: 250,
				stations: [107,106,108]
			},
			mater: {
				center: {lat:53.356944, lng: -6.268241},
				size: 450,
				stations: [110,102,30,2,15,61,79,12,79]
			},
			mountjoy: {
				center: {lat: 53.357193, lng: -6.258799},
				size: 250,
				stations: [44,59,28,111	]
			},
			croke_park: {
				center: {lat: 53.357738, lng: -6.251297},
				size: 100,
				stations: [112]
			},
			killarney_st: {
				center: {lat: 53.354837, lng: -6.249084},
				size: 230,
				stations: [115,109]
			},
			gpo: {
				center: {lat: 53.349260, lng: -6.260159},
				size: 100,
				stations: [33]
			},
			fibbers: {
				center: {lat: 53.352115, lng: -6.260852},
				size: 100,
				stations: [24]
			},
			talbot_st: {
				center: {lat: 53.352098, lng: -6.254326},
				size: 150,
				stations: [38,45]
			},
			
	};

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

                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes +  "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands);
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
                        infowindow.setContent("<b>" + data.coordinates[i].name + "</b>" + "<br/><b>" + " Available Bikes: " + "</b>" + data.coordinates[i].bikes +  "<br/><b>" + " Available Stands: " + "</b>" + data.coordinates[i].stands);
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
