var stationData = []

var url = 'http://localhost:5000/api/coordinates';

//Autocomplete feature

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  	//Could include the working code outside fetch in here but is very messy
  	//Will however be slower and will not run immediately because of this
  	for (var i = 0; i < data.coordinates.length; i++){
  		stationData.push(data.coordinates[i].name)
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
  alert(station);
}



inputBox.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   //findStation()
   //document.getElementById("searchBtn").click();
  }
});



