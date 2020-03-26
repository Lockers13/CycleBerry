var stationData = [];
var uniqueNames = [];

var url = 'http://localhost:5000/api/coordinates';

//Autocomplete feature

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  	for (var i = 0; i < data.coordinates.length; i++){
    //Prevent issue with duplicates station names, -1 returned if not in array
    if(stationData.indexOf(data.coordinates[i].name) === -1) {
      stationData.push(data.coordinates[i].name);
      }
  	}
  });



//Use of jquery and jqueryui here
 $( function() {
    $( "#stationtextbox" ).autocomplete({
      source: stationData
    });
  } );



//Search station feature

const inputBox = document.getElementById('stationtextbox');

function findStation(){
  var station = inputBox.value;
}



inputBox.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
  }
});





