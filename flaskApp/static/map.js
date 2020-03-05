		
// Initialize and add the map
function initMap() {
	var dublin = {lat: 53.3498, lng: -6.2603};
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: dublin});
  var marker = new google.maps.Marker({position: dublin, map: map});
  }

  $(document).ready(function() {
      console.log("Hello");
      fetch('http://localhost:5000/api/coordinates').then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function(data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      });
  })

  