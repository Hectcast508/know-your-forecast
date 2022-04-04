var searchFormEl = document.querySelector("#searchBar");
var cityInputEL = document.querySelector("#cityname");
var searchedHistoryEl = document.querySelector("#oldSearch");

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
    .then(response => response.json())
    .then(data => coordsInsert(data,city));
 
} 

var coordsInsert = function(response,city) {
  var latCoord = response.coord.lat;
  var lonCoord = response.coord.lon;
  var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latCoord + "&lon=" + lonCoord + "&exclude=minutely.hourly,alerts&units=imperial&appid=289b9adb4aa40c0962e1fa10706b278b";

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => forecastCall(data,city));

  
}

var forecastCall = function(data,city){
  displayWeather(data, city);
  display5day(data,data.daily);
}

var changeTimestamp = function(time) {
  var convDate = new Date(time*1000)
  var date = convDate.toLocaleDateString().split(',')[0];
  return date;
}

var colorUV = function(uv) {
    var color;
    if (uv < 2) {
      color = 'green'
    }
    else if (uv >= 2 && uv <5) {
      color = 'yellow'
    }
    else if (uv >= 5 && uv <7) {
      color = 'orange'
    }
    else if (uv >= 7 && uv <10) {
      color = 'red'
    }
    else if (uv >= 10) {
      color = 'violet'
    }
    return color  ;
}

var displayWeather = function(data,city) {
  var date = changeTimestamp(data.current.dt);
  var temp = data.current.temp;
  var wind = data.current.wind_speed;
  var humidity = data.current.humidity;
  var uv = data.daily[0].uvi;

  
  
  $("#city-weather")
  .empty()
  .append("<h2>"+ city +" "+ date +"</h2><img class='rounded-circle' src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png' alt=''><p class='col-12 p-0'>Temp: "+ temp +"℉</p><p class='col-12 p-0'>Wind: "+ wind +" MPH</p><p class='col-12 p-0'>Humidity: "+ humidity +"%</p><p class='col-12 p-0 '>UV Index: <span id='uvColor' class='rounded p-1 "+ colorUV(uv) +"'>"+ uv +"</span></p>");
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