var weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

var times = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];

var submitBtn = document.getElementById('formBtn');

var urlStart = "http://localhost:5000/api/station_stats/predictions/";

var urlEnd = "/monday/Clouds/15.0/15";

//Use of jquery and jqueryui here to autocomplete form
 $( function() {
    $( "#weekdayBox" ).autocomplete({
      source: weekdays
    });
  } );

 $( function() {
    $( "#timeBox" ).autocomplete({
      source: times
    });
  } );



//Set global variables to get info for fetch
var stationNumber;

//Used to display form after button click of prediction button
function showForm (stationName, stationNum){
	document.getElementById('recently_used').style.display= 'none';
    document.getElementById('predictForm').style.display= 'block';
    document.getElementById('formName').innerHTML = stationName;
    stationNumber = stationNum;
}

//Actual fetch of predictions given certain input data
submitBtn.addEventListener("click", function (event) {

	//Getting values in form input boxes
	var day = document.getElementById("weekdayBox").value.toLowerCase();
	var time = document.getElementById("timeBox").value.slice(0,2);

	//Doing actual fetch
	fetch(urlStart + stationNumber + "/" + day + "/Clouds/15.0/" + time)
        .then(response => response.json())
        .then(function (prediction) {
            alert(prediction.prediction);
        })   
});




