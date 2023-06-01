// Converts HTML elements, IDs, and classes into JS variables
var searchText = document.getElementById("search-text");
var parkResults = document.getElementById("park-results");
var weatherResults = document.getElementById("weather-results");
var currentDateTime = document.getElementById("current-date-time");
var geoLatitude = ""
var geoLongitude = ""
var submitBtn = document.getElementById("submit-button");
var previouslyViewed = document.getElementById("previously-viewed");

// searchText.value = localStorage.getItem("park name:")
// Updates the time live without need for refreshing.
function updateDateTime() {
  // pulls current date and time from dayjs and formats it.
  currentDateTime.textContent = dayjs().format('  dddd, MMMM D, YYYY hh:mm A');
}
updateDateTime();
function updateDateTime() {
  const now = dayjs();
  // adds a string to dayjs information being pulled.
  const formattedDateTime = 'Current Date:   ' + now.format('  dddd, MMMM D, YYYY') + ', Time: ' + now.format('hh:mm A');
  currentDateTime.textContent = formattedDateTime;
}

// sets time to update by 1 second
setInterval(updateDateTime, 1000);
// function that utilizes NPS API for national parks.
function parksAPI(){
  var npsURL = "https://developer.nps.gov/api/v1/parks?q=" + searchText.value
  var requestOptions = {
    headers: {
      "X-Api-Key": "gR3rkp0DY7kD7YHJnn3gFoMdL58O5r1tHDvhqcpS",
    }
  }
  // fetch for NPS API to get park information matching user input
  fetch(npsURL, requestOptions)
  .then(function(response){
      return response.json();
  }) .then(function(res){
      console.log(res);
        for (let i = 0; i < res.data.length; i++){
          var optionButton = document.createElement("button")
          optionButton.textContent=res.data[i].fullName
          optionButton.setAttribute("value", `${res.data[i].latitude},${res.data[i].longitude}`)
          // dynamically creates park selection button.
          parkResults.appendChild(optionButton)
          optionButton.onclick= parkSelection
        }
  })
 
}
// event listener for the form submit event
submitBtn.addEventListener('click', function(event) {
  event.preventDefault();
  // var parkName = searchText.value;
  // localStorage.setItem("park name:", parkName)

  
  parksAPI()
})



previouslyViewed.addEventListener('click', function(event) {
  event.preventDefault();
  localStorage.getItem("history", currentSavedParks)
});

// function that collects user input for park search and returns results for that park.
function parkSelection (event){
  var latLon = event.target.value
  var parkName = event.target.textContent;
  geoLatitude=latLon.split(",")[0]
  geoLongitude=latLon.split(",")[1]
  // console logs lat and lon information
  console.log(geoLatitude)
  console.log(geoLongitude)
  getWeatherNow(parkName)
  // saves park data to users local storage.
  var currentSavedParks = JSON.parse(localStorage.getItem("park name:")) || []
  currentSavedParks.push(parkName)
  localStorage.setItem("park name:", JSON.stringify(currentSavedParks))
}
// function that grabs the park user selects and pulls it's Longitude and latitude coordinates to get the weather information for the park.
function getWeatherNow(park){
    var weatherNowUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + geoLatitude + "&lon=" + geoLongitude + "&units=imperial&appid=42c66a48a76a8c63ca42a8a780c249a4"
    weatherResults.innerHTML=""
    fetch(weatherNowUrl)
    .then(function(response){
        return response.json();
    }) .then(function(data){
        console.log(data);
        var parkHeader = document.createElement("h2");
        parkHeader.textContent = park;
        weatherResults.appendChild(parkHeader)
        // creates weather icon element.
        parkWeatherIcon = document.createElement("img")
        // links weather icon .
        parkWeatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        // creates p element .
        var parkTemp = document.createElement("p");
        // adds a string to tempature data.
        parkTemp.textContent = "Temperature: " + data.main.temp + "°F";
        var parkHum = document.createElement("p");
        parkHum.textContent = "Humidity: " + data.main.humidity + "%";
        var parkWindSpeed = document.createElement("p");
        parkWindSpeed.textContent = "Wind Speed: " + data.wind.speed + "MPH";
        var storageTemp = data.main.temp + "°F";
        weatherResults.appendChild(parkWeatherIcon);
        weatherResults.appendChild(parkTemp);
        weatherResults.appendChild(parkHum);
        weatherResults.appendChild(parkWindSpeed);
        // Saves tempature data to user's localstorage. 
        localStorage.setItem("Temperature:", storageTemp)
    })
}
