
// Initialize and add the map
var url = 'http://localhost:5000/api/coordinates';

function initMap(data) {
  return fetch(url)
    .then(response => response.json())
    .then(function (data) {
      var dublin = { lat: 53.3498, lng: -6.2603 };
      var map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: 12,
          center: dublin,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var coord_len = data.coordinates.length;
        for (i = 0; i < coord_len; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.coordinates[i].lat, data.coordinates[i].lng),
            map: map
          });
          google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
              infowindow.setContent(data.coordinates[i].name);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    });
}













/*$(document).ready(function () {
  getData(url);// { "userId": 1, "id": 1, "title": "...", "body": "..." }
});*/



/*function getData(url) {
  console.log("hello");
}*/



