// Converts HTML elements, IDs, and classes into JS global variables
var searchText = document.getElementById("search-text");
var parkResults = document.getElementById("park-results");
var weatherResults = document.getElementById("weather-results");
var currentDateTime = document.getElementById("current-date-time");
var geoLatitude = ""
var geoLongitude = ""
var submitBtn = document.getElementById("submit-button");
var forecastDiv = document.getElementById("park-forecast");
var parkOptionsEl = document.getElementById("park-options");
var parkWeatherResultsEl = document.getElementById("park-weather");
var searchHistory = document.getElementById("search-history-tab");
var previouslyViewed = document.getElementById("previously-viewed");
var searchHistoryResults = document.getElementById("search-history-results");
var infoSections = document.querySelectorAll(".info-section");
var searchHistoryTabH1 = document.getElementById("search-history-results-h1");
var footerBox = document.getElementById("footer-box");
var forecastText = document.getElementById("forecast-header");
var homeButton = document.getElementById("home-button");
var currentSavedParks = JSON.parse(localStorage.getItem("parkData")) || []

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
          parkOptionsEl.appendChild(optionButton)
          optionButton.onclick= parkSelection
        }
  })
 
}

// event listener for the form submit event
submitBtn.addEventListener('click', function(event) {
  parkOptionsEl.innerHTML=""
  event.preventDefault();
  for (var i = 0 ; i < infoSections.length; i ++){
    infoSections[i].style.display = "inline-flex"
  };
  forecastText.style.display = "block"

  parksAPI()
})

// creates event listener that refreshes page when home button is clicked.
homeButton.addEventListener("click", function() {
  location.reload();
})


// function that collects user input for park search and returns results for that park.
function parkSelection (event){
  var latLon = event.target.value
  var parkName = event.target.textContent;
  geoLatitude=latLon.split(",")[0]
  geoLongitude=latLon.split(",")[1]
  // console logs lat and lon information.
  console.log(geoLatitude)
  console.log(geoLongitude)
  getWeatherNow(parkName)
  getWeatherForecast()
  // saves park data to users local storage.
  var parkData = {
    name: parkName,
    lat: geoLatitude,
    lon: geoLongitude,
  }
  currentSavedParks.push(parkData)
  localStorage.setItem("parkData", JSON.stringify(currentSavedParks))
  console.log(currentSavedParks)
}
// function that grabs the park user selects and pulls it's Longitude and latitude coordinates to get the weather information for the park.
function getWeatherNow(park){
    var weatherNowUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + geoLatitude + "&lon=" + geoLongitude + "&units=imperial&appid=42c66a48a76a8c63ca42a8a780c249a4"
    parkWeatherResultsEl.innerHTML=""
    fetch(weatherNowUrl)
    .then(function(response){
        return response.json();
    }) .then(function(data){
        console.log(data);
        var parkHeader = document.createElement("h3");
        parkHeader.textContent = park;
        parkWeatherResultsEl.appendChild(parkHeader)
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
        parkWeatherResultsEl.appendChild(parkWeatherIcon);
        parkWeatherResultsEl.appendChild(parkTemp);
        parkWeatherResultsEl.appendChild(parkHum);
        parkWeatherResultsEl.appendChild(parkWindSpeed);
    })
}


function getWeatherForecast(){
  var weatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + geoLatitude + "&lon=" + geoLongitude + "&units=imperial&appid=42c66a48a76a8c63ca42a8a780c249a4"
      
      fetch(weatherForecastUrl)
      .then(function(response){
          return response.json()
      }) .then(function(data){
          console.log(data)
          
                  //tutor Assistance from Faran Navazi  for clearing any dynamically created divs from previous searches without reloading the page. 
              forecastDiv.innerHTML = ""
  
          for (let j = 0; j < data.list.length; j++){
              if ((j === 6) ||
              (j === 14) ||
              (j === 22) ||
              (j === 30) ||
              (j === 38)) {
  
            var forecastBox = document.createElement("div")
            var forecastDate = document.createElement("p")
            forecastDate.setAttribute("class", "forecastData")
            forecastDate.textContent = "Date: " + data.list[j].dt_txt
            var forecastIcon = document.createElement("img")
            forecastIcon.setAttribute("id", "forecastItemIcon")
                      //assistance from tutor Faran Navazi to get the icon to display
            forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`)
            var forecastTemp = document.createElement("p")
            forecastTemp.setAttribute("class", "forecastData")
            forecastTemp.textContent = "Temperature: " + data.list[j].main.temp + " °F"
            var forecastHum = document.createElement("p")
            forecastHum.setAttribute("class", "forecastData")
            forecastHum.textContent = "Humidity: " + data.list[j].main.humidity + "%"
            var forecastWindSpeed = document.createElement("p")
            forecastWindSpeed.setAttribute("class", "forecastData")
            forecastWindSpeed.textContent = "Wind Speed: " + data.list[j].wind.speed + " MPH"
            forecastBox.setAttribute("class", "forecastItem") 
            forecastDiv.appendChild(forecastBox) 
            forecastDate.appendChild(forecastIcon)
            forecastBox.appendChild(forecastDate)
            forecastBox.appendChild(forecastTemp)
            forecastBox.appendChild(forecastHum)
            forecastBox.appendChild(forecastWindSpeed)
          }
      }
      })
  
  }



previouslyViewed.addEventListener('click', function(event) {
  event.preventDefault();
  for (var i = 0 ; i < infoSections.length; i ++){
    infoSections[i].style.display = "none"
  };
  searchHistory.style.display = "block";
  searchHistoryTabH1.style.display = "block";
  searchHistoryResults.style.display = "block";
  footerBox.style.display = "none";
  forecastText.style.display = "none";
  forecastDiv.style.display = "none";
  parkOptionsEl.style.display = "none";
  //searchHistoryResults.innerHTML = JSON.parse(localStorage.getItem("park name:")) || []

  renderPreviouslyViewed()
});
  
function renderPreviouslyViewed(parkButtonText){
    for (var i = 0; i < currentSavedParks.length; i++) {
        var parkButton = document.createElement("button")
        parkButton.setAttribute("class", "previous-park-button")
        var parkButtonText = currentSavedParks[i].name;
        geoLatitude = currentSavedParks[i].lat;
        geoLongitude = currentSavedParks[i].lon;
        parkButton.textContent = parkButtonText
        searchHistory.appendChild(parkButton)
        parkButton.onclick = searchAgain 
      } 
}

function searchAgain(event){
  console.log(event.target)
  searchHistory.style.display = "none";
  for (var i = 0 ; i < infoSections.length; i ++){
    infoSections[i].style.display = "inline-flex"
  };
  forecastText.style.display = "block"
  forecastDiv.style.display = "flex"
  getWeatherNow(event.target.textContent)
  getWeatherForecast()
}