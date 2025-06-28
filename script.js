const apiKey = '4eb3703790b356562054106543b748b2'; // Replace this with your actual OpenWeatherMap API key

const searchBtn = document.getElementById('search-btn');
const inputBox = document.getElementById('input-box');
const weatherBody = document.getElementById('weather-body');
const locationBtn = document.getElementById('location-btn');

// Manual city search
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city === "") {
        swal("Oops!", "Please enter a city name.", "warning");
        return;
    }
    getWeatherByCity(city);
});

// Use My Location button
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        weatherBody.innerHTML = `<p>📡 Detecting your location...</p>`;
        navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);
    } else {
        swal("Oops!", "Geolocation is not supported by your browser.", "error");
    }
});

// Geolocation success
function onPositionSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoords(lat, lon);
}

// Geolocation error
function onPositionError(error) {
    swal("Notice", "Location access denied or unavailable. Please search manually.", "info");
    console.warn(`Geolocation error: ${error.message}`);
}

// Fetch weather by city
async function getWeatherByCity(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    await fetchWeather(apiURL);
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    await fetchWeather(apiURL);
}

// Unified fetch handler
async function fetchWeather(apiURL) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error("Weather data not found.");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        swal("Error", error.message, "error");
        weatherBody.innerHTML = "";
    }
}

// Display weather info
function displayWeather(data) {
    const { name, main, weather, wind } = data;

    weatherBody.innerHTML = `
        <div class="weather-card">
            <h2>${name}</h2>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        </div>
    `;
}
