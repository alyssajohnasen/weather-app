function formatDate(timestamp) {
  let currentDate = new Date(timestamp);
  let date = currentDate.getDate();
  let year = currentDate.getFullYear();
  
  
  let dayIndex = currentDate.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[dayIndex];
  
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = months[currentDate.getMonth()];

  return `${day}, ${month} ${date}, ${year} | ${formatHours(timestamp)}`;

}

function formatHours(timestamp) {
  let currentDate = new Date(timestamp);
  let currentTime = currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return `${currentTime}`;
}

function displayWeatherCondition(response) {
  fahrenheitTemperature = response.data.main.temp;
  feelsLikeElement = response.data.main.feels_like;
  maxTemp = response.data.main.temp_max;
  minTemp = response.data.main.temp_min;
  
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-forecast-description").innerHTML = response.data.weather[0].description;
  document.querySelector("#current-temperature").innerHTML = Math.round(fahrenheitTemperature);
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeElement);
  document.querySelector("#sunrise").innerHTML = formatHours(response.data.sys.sunrise * 1000);
  document.querySelector("#sunset").innerHTML = formatHours(response.data.sys.sunset * 1000);
  document.querySelector("#max-temp").innerHTML = Math.round(maxTemp);
  document.querySelector("#min-temp").innerHTML = Math.round(minTemp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#current-time").innerHTML = formatDate(response.data.dt * 1000);
  document.querySelector("#current-temp-icon").setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#current-temp-icon").setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
        <h5>
          ${formatHours(forecast.dt * 1000)}
        </h5>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
        <div class="weather-forecast-temperature">
          <strong><span id="forecast-max">${Math.round(forecast.main.temp_max)}</span>°</strong> / <span id="forecast-min">${Math.round(forecast.main.temp_min)}</span>°
        </div>
    </div>`;
    
  }
}

function searchCity(city) {
  let apiKey = "28aa11ac2c3547ae8dd36de6f31e399a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#enter-city").value;
  searchCity(city);
}

function searchCurrentLocation(position) {
  let apiKey = "28aa11ac2c3547ae8dd36de6f31e399a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-temperature");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#feels-like").innerHTML = Math.round((feelsLikeElement - 32) * 5 / 9);
  document.querySelector("#max-temp").innerHTML = Math.round((maxTemp - 32) * 5 / 9);
  document.querySelector("#min-temp").innerHTML = Math.round((minTemp - 32) * 5 / 9);
  
  let forecastMax = document.querySelectorAll("#forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp - 32) * 5 / 9);
  });

  let forecastMin = document.querySelectorAll("#forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp - 32) * 5 / 9);
  });

  celsiusLink.removeEventListener("click", displayCelsius);
  fahrenheitLink.addEventListener("click", displayFahrenheit);
}

function displayFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeElement);
  document.querySelector("#max-temp").innerHTML = Math.round(maxTemp);
  document.querySelector("#min-temp").innerHTML = Math.round(minTemp);
  
  let forecastMax = document.querySelectorAll("#forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll("#forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  fahrenheitLink.removeEventListener("click", displayFahrenheit);
  celsiusLink.addEventListener("click", displayCelsius);
}

let fahrenheitTemperature = null;
let feelsLikeElement = null;
let maxTemp = null;
let minTemp = null;

let searchForm = document.querySelector("#search-engine");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

searchCity("Honolulu");
