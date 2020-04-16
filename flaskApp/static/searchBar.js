
var stationData = [];
var uniqueNames = [];
// replace (#, @) with (hostname, port) in url below
var url = 'http://#:@/api/coordinates';

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







