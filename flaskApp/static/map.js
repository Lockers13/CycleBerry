// Initialize and add the map
var url = 'http://localhost:5000/api/coordinates';

function initMap(data) {
  return fetch(url)
    .then(response => response.json())
    .then(function (data) {
      
      var dublin = { lat: 53.3498, lng: -6.2603 };
      var map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: 14,
          center: dublin,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });


        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };


        var image = {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };


        var coord_len = data.coordinates.length;
        for (i = 0; i < coord_len; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng),
            map: map,
            icon: image,
            shape: shape,
            title: "CycleBerry"
          });


          google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
              infowindow.setContent(data.coordinates[i].num + ": " + data.coordinates[i].name + ". Available Bikes: " + data.coordinates[i].bikes + ". Available Stands: " + data.coordinates[i].stands);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    });
}