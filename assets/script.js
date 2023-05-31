// Converts HTML elements, IDs, and classes into JS variables
var searchText = document.getElementById("search-text");
var flightResults = document.getElementById("flight-results");
var weatherResults = document.getElementById("weather-results");
var currentDateTime = document.getElementById("current-date-time");
var geoLatitude = ""
var geoLongitude = ""

var submitBtn = document.getElementById("submit-button");
// Updates the time live without need for refreshing.
function updateDateTime() {
  currentDateTime.textContent = dayjs().format('MM-DD-YYYY HH:mm:ss');
}
updateDateTime();

// sets time to update by 1 second
setInterval(updateDateTime, 1000);
// 
function parksAPI(){
  var npsURL = "https://developer.nps.gov/api/v1/parks?q=yellowstone" 
  var requestOptions = {
    headers: {
      "X-Api-Key": "gR3rkp0DY7kD7YHJnn3gFoMdL58O5r1tHDvhqcpS",
    }
  }
  fetch(npsURL, requestOptions)
  .then(function(response){
      return response.json();
  }) .then(function(data){
      console.log(data);
      console.log(data.data[2].latitude)
      console.log(data.data[2].longitude)
      geoLatitude = data.data[2].latitude
      geoLongitude = data.data[2].longitude

 }).then(function(){
	 getWeatherNow()
   })
}
// event listener for the form submit event
submitBtn.addEventListener('click', function(event) {
  event.preventDefault();
  currentDateTime.style.display = "none";
})


parksAPI()

function getWeatherNow(){
    var weatherNowUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + geoLatitude + "&lon=" + geoLongitude + "&units=imperial&appid=42c66a48a76a8c63ca42a8a780c249a4"

    fetch(weatherNowUrl)
    .then(function(response){
        return response.json();
    }) .then(function(data){
        console.log(data);
        // icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        // tempNow.textContent = data.main.temp;
        // humNow.textContent = data.main.humidity;
        // windNow.textContent = data.wind.speed;
    })
}

