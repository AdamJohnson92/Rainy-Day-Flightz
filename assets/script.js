// Converts HTML elements, IDs, and classes into JS variables
var searchText = document.getElementById("search-text");
var parkResults = document.getElementById("park-results");
var weatherResults = document.getElementById("weather-results");
var currentDateTime = document.getElementById("current-date-time");
var geoLatitude = ""
var geoLongitude = ""
var submitBtn = document.getElementById("submit-button");
var forecastDiv = document.getElementById("park-forecast");
var parkOptionsEl = document.getElementById("park-options");
var parkWeatherResultsEl = document.getElementById("park-weather")


// searchText.value = localStorage.getItem("park name:")
// Updates the time live without need for refreshing.
function updateDateTime() {
  currentDateTime.textContent = dayjs().format('MM-DD-YYYY HH:mm:ss');
}
updateDateTime();

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
  event.preventDefault();
  var parkName = searchText.value;
  localStorage.setItem("park name:", parkName)

  
  parksAPI()
})
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
  getWeatherForecast(parkName)
  // saves park data to users local storage.
  localStorage.setItem("park name:",parkName)
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
        parkWeatherIcon = document.createElement("img")
        parkWeatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        var parkTemp = document.createElement("p");
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
        // Saves tempature data to user's localstorage. 
        localStorage.setItem("Temperature:", storageTemp)
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
            forecastDate.textContent = "Date: " + data.list[j].dt_txt
            var forecastIcon = document.createElement("img")
            forecastIcon.setAttribute("id", "forecastItemIcon")
                      //assistance from tutor Faran Navazi to get the icon to display
            forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`)
            var forecastTemp = document.createElement("p")
            forecastTemp.textContent = "Temperature: " + data.list[j].main.temp + " °F"
            var forecastHum = document.createElement("p")
            forecastHum.textContent = "Humidity: " + data.list[j].main.humidity + "%"
            var forecastWindSpeed = document.createElement("p")
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
