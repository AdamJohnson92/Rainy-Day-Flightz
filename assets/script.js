// Converts HTML elements, IDs, and classes into JS variables
var searchText = document.getElementById("search-text");
var flightResults = document.getElementById("flight-results");
var weatherResults = document.getElementById("weather-results");
var currentDateTime = document.getElementById("current-date-time");
var submitBtn = document.getElementById("search-bar");
// Updates the time live without need for refreshing.
function updateDateTime() {
  currentDateTime.textContent = dayjs().format('MM-DD-YYYY HH:mm:ss');
}
updateDateTime();

// sets time to update by 1 second
setInterval(updateDateTime, 1000);



