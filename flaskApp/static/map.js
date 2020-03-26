// Initialize and add the map
var url = 'http://localhost:5000/api/coordinates';
var url_stats = "http://localhost:5000/api/station_stats/"


function initMap(data) {

    var dublin = {
        lat: 53.3498,
        lng: -6.2603
    };

    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 14,
            center: dublin,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
           //Following styles array used to edit map colour
            styles: [
                {
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#f5f5f5"
      }
    ]
  },
                {
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
      }
    ]
  },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#616161"
      }
    ]
  },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#f5f5f5"
      }
    ]
  },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#bdbdbd"
      }
    ]
  },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
      }
    ]
  },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
      }
    ]
  },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
      }
    ]
  },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
      }
    ]
  },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#ffffff"
      }
    ]
  },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
      }
    ]
  },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#dadada"
      }
    ]
  },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#616161"
      }
    ]
  },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
      }
    ]
  },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
      }
    ]
  },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
      }
    ]
  },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#28A7E8"
      }
    ]
  },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#28A7E8"
      }
    ]
  }
]
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


            var markerList = []
            var coord_len = data.coordinates.length;
            for (i = 0; i < coord_len; i++) {
                var num_bikes = data.coordinates[i].bikes;
                var img_dex = num_bikes <= 10 ? (num_bikes <= 5 ? 2 : 1) : 0;

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng),
                    map: map,
                    icon: image_array[img_dex],
                    shape: shape,
                    title: data.coordinates[i].name
                });
                markerList.push(marker)


                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {

                        infowindow.setContent(data.coordinates[i].num + ": " + data.coordinates[i].name + ". Available Bikes: " + data.coordinates[i].bikes + ". Available Stands: " + data.coordinates[i].stands);
                        infowindow.open(map, marker);
                        fetch(url_stats + data.coordinates[i].num)
                            .then(response => response.json())
                            .then(function (stat_id) {
                                //alert(stat_id.avg);
                            });
                    }
                })(marker, i));
            }

            /* Code for search bar functionality begins here*/

            const inputBox = document.getElementById('stationtextbox');

            function findStation() {
                var station = inputBox.value;
                //alert(station);
                for (i = 0; i < markerList.length; i++) {
                    if (station == markerList[i].title) {
                        infowindow.setContent(data.coordinates[i].num + ": " + data.coordinates[i].name + ". Available Bikes: " + data.coordinates[i].bikes + ". Available Stands: " + data.coordinates[i].stands);
                        infowindow.open(map, markerList[i]);
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
