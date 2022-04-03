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

var coordsInsert = function(response,city) {
  var latCoord = response.coord.lat;
  var lonCoord = response.coord.lon;
  var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latCoord + "&lon=" + lonCoord + "&exclude=minutely.hourly,alerts&units=imperial&appid=289b9adb4aa40c0962e1fa10706b278b"

  fetch(weatherUrl)
  .then(function(response) {
    if(response.ok) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
        displayWeather(data, city);
        display5day(data,data.daily);
      })
    }
  })
}

var changeTimestamp = function(time) {
  var convDate = new Date(time*1000)
  var date = convDate.toLocaleDateString().split(',')[0];
  return date;
}

var displayWeather = function(data, city) {
  var date = changeTimestamp(data.current.dt);
  var temp = data.current.temp;
  var wind = data.current.wind_speed;
  var humidity = data.current.humidity;
  var uv = data.current.uvi;

  $("#city-weather")
  .empty()
  .append("<h2>"+ city +" "+ date +"</h2><p>Temp: "+ temp +"℉</p><p>Wind: "+ wind +" MPH</p><p>Humidity: "+ humidity +"%</p><p>UV Index: <span class='rounded p-1'>"+ uv +"</span></p>");
}

var display5day = function(data,daily) {
  
  $("#city-forecast").empty()
  for(let i = 1; i < 6; i++) {
    var iconIn = daily[i];
    var date = changeTimestamp(data.daily[i].dt);
    var temp = data.daily[i].temp.day;
    var wind = data.daily[i].wind_speed;
    var humidity = data.daily[i].humidity;
    
    $("#city-forecast")
    .append("<div class='card bg-dark text-light w-100 mx-1'><div class='p-2'><h3 class='text-center'>"+ date +"</h3><img class='card-img-top w-50 mt-2 mx-auto rounded-circle' src='http://openweathermap.org/img/wn/" + iconIn.weather[0].icon + ".png' alt=''><div class='p-2'><p class='card-text'>Temp: "+ temp +"℉</p><p class='card-text'>Wind: "+ wind +" MPH</p><p class='card-text'>Humidity: "+ humidity +"%</p></div></div>");
  }


}

searchFormEl.addEventListener("submit", citySubmit);