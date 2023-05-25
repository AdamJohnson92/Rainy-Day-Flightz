var searchText = document.getElementById ("searchText");
var flightResults = document.getElementById("flightResults");
var weatherResults = document.getElementById("weatherResults");
var currentDateTime = document.getElementById("currentDateTime");
// Updates the time live without need for refreshing.
function updateDateTime() {
  currentDateTime.textContent = dayjs().format('MM-DD-YYYY HH:mm:ss');
}
updateDateTime();

// sets time to update by 1 second
setInterval(updateDateTime, 1000);