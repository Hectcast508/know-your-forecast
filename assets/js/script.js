var searchFormEl = document.querySelector("#searchBar");
var cityInputEL = document.querySelector("#cityname");

var citySubmit = function(event) {
  event.preventDefault();

  var cityName = cityInputEL.value;

  if (cityName) {
    getCityName(cityName);

    cityInputEL.value = "";
  }
};

var getCityName = function(city) {
  var coordsUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city.replace(/\s/g, "+") +"&appid=289b9adb4aa40c0962e1fa10706b278b";

  fetch(coordsUrl)
  .then(function(response) {
    if(response.ok) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
        coordsInsert(data,city);
      })
    }
  })
 
} 

var coordsInsert = function(response) {
  var latCoord = response.coord.lat;
  var lonCoord = response.coord.lon;
  var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latCoord + "&lon=" + lonCoord + "&exclude=minutely.hourly,alerts&units=imperial&appid=289b9adb4aa40c0962e1fa10706b278b"

  fetch(weatherUrl)
  .then(function(response) {
    if(response.ok) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
      })
    }
  })
}

searchFormEl.addEventListener("submit", citySubmit);