function formatDate(timestamp) {
  let currentDate = new Date(timestamp);
  let date = currentDate.getDate();
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = currentDate.getFullYear();
  
  
  let dayIndex = currentDate.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[dayIndex];
  
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = months[currentDate.getMonth()];

  return `${day}, ${month} ${date}, ${year} | ${hours}:${minutes}`;

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
  document.querySelector("#max-temp").innerHTML = Math.round(maxTemp);
  document.querySelector("#min-temp").innerHTML = Math.round(minTemp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#current-time").innerHTML = formatDate(response.data.dt * 1000);
  document.querySelector("#current-temp-icon").setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#current-temp-icon").setAttribute("alt", response.data.weather[0].description);
}

function searchCity(city) {
  let apiKey = "28aa11ac2c3547ae8dd36de6f31e399a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeatherCondition);
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
