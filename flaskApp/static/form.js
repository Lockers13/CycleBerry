//Need to fetch forecast for accurate predictions
//weatherDay is number from 0 to 6
//weatherTime time broken into 3 hour groups
//inputDay is string from input box
//Input time is string from input box
function forecastFetch (weatherDay, weatherTime, inputDay, inputTime) {
  fetch('http://api.openweathermap.org/data/2.5/forecast?id=2964574&appid=b1ee46f8fbe84528da68642cbfa3ff78&units=metric')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (i = 0; i < data.list.length; i++){
      var date = new Date(data.list[i].dt * 1000);
      var day = date.getDay();
      var hour = date.getHours() - 1;
      if (day == weatherDay && hour == weatherTime){
        forecastTemp = (data.list[i].main.temp);
        forecastWeather = (data.list[i].weather[0].main);
        //Actual fetch of the prediction
        fetch(urlStart + stationNumber + "/" + inputDay + "/" + forecastWeather +"/" + forecastTemp + "/" + inputTime)
          .then(response => response.json())
          .then(function (prediction) {
              document.getElementById('predictionResult').innerHTML = "Bikes Available: " + prediction.prediction
          })   
      }  
    }
  });
};


//Need to get day of the week so can include five next days as option for prediction
function getDays (){
    var date = new Date(); 
    day = date.getDay()
}
getDays();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//Need to create list of next five days as weather forecast is for five days
var fiveDays = [];

var count = 0;
for (i = day; count < 5; i++){
  //Have to go back to Sunday after Saturday
  if (i == 7){
    i = 0;
  }
  count += 1;
  fiveDays.push(weekdays[i]);
}

//List of possible times for autocomplete time
var times = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];

var submitBtn = document.getElementById('formBtn');

// replace (#, @) with (hostname, port) in below url
var urlStart = "http://#:@/api/station_stats/predictions/";

//Use of jquery and jqueryui here to autocomplete form
 $( function() {
    $( "#weekdayBox" ).autocomplete({
      source: fiveDays
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
  //Clear any error messages from previous forms
  document.getElementById('errorMessage').style.display = 'none';
  //Show new form
  document.getElementById('predictForm').style.display= 'block';
  //Add station name to form
  document.getElementById('formName').innerHTML = stationName;
  stationNumber = stationNum;
}


//Actual fetch of predictions given certain input data
submitBtn.addEventListener("click", function (event) {
  //Clear any error messages already in place
  document.getElementById('errorMessage').style.display = 'none';
  //Basic error handling
  var dayTest = weekdays.includes(document.getElementById("weekdayBox").value)
  var timeTest = times.includes(document.getElementById("timeBox").value)
  if (dayTest == true && timeTest == true){
    //Getting values in form input boxes
    var day = document.getElementById("weekdayBox").value.toLowerCase();
    var time = document.getElementById("timeBox").value.slice(0,2);
    //Forecast is only for every 3 hours so need to group
    if (time == "00" || time == "01" || time == "02"){
      var weatherTime = "00"
    } else if (time == "03" || time == "04" || time == "05"){
      var weatherTime = "03"
    } else if (time == "06" || time == "07" || time == "08"){
      var weatherTime = "06"
    } else if (time == "09" || time == "10" || time == "11"){
      var weatherTime = "09"
    } else if (time == "12" || time == "13" || time == "14"){
      var weatherTime = "12"
    } else if (time == "15" || time == "16" || time == "17"){
      var weatherTime = "15"
    } else if (time == "18" || time == "19" || time =="20"){
      var weatherTime = "18"
    } else {
      var weatherTime = "21";
    }
    //Need to get the numerical representation of the day input
    if (day == "sunday"){
      var weatherDay = 0;
    } else if (day == "monday"){
      var weatherDay = 1;
    } else if (day == "tuesday"){
      var weatherDay = 2;
    } else if (day == "wednesday"){
      var weatherDay = 3;
    } else if (day == "thursday"){
      var weatherDay = 4;
    } else if (day == "friday"){
      var weatherDay = 5;
    } else {
      var weatherDay = 6;
    }
    //this performs fetch of weather data and prediction
    forecastFetch(weatherDay, weatherTime, day, time);
  } else {
    //Display error message
    document.getElementById('errorMessage').style.display = 'block';
  }
});










