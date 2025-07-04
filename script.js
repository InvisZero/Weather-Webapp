const apiKey = 'f03e283ada6ccb3c47d6de30c310a237';

const searchBtn = document.getElementById('search-btn');
const locateBtn = document.getElementById('locate-btn');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('daily-forecast');
const hourlyChartCanvas = document.getElementById('hourlyChart');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchCityCoordinates(city);
  }
});

locateBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      alert("Unable to access location.");
    }
  );
});

async function fetchCityCoordinates(city) {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const res = await fetch(geoUrl);
  const data = await res.json();
  if (data.length > 0) {
    const { lat, lon } = data[0];
    fetchWeather(lat, lon);
  } else {
    alert("City not found.");
  }
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayCurrent(data);
  displayDaily(data.daily);
  renderHourlyChart(data.hourly);
}

function displayCurrent(data) {
  const weather = data.current.weather[0];
  currentWeatherDiv.innerHTML = `
    <h2>${new Date(data.current.dt * 1000).toLocaleString()}</h2>
    <p><strong>Temperature:</strong> ${data.current.temp}°C</p>
    <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
    <p><strong>Wind:</strong> ${data.current.wind_speed} km/h</p>
    <p><strong>Condition:</strong> ${weather.main} (${weather.description})</p>
  `;
}

function displayDaily(daily) {
  forecastDiv.innerHTML = '';
  daily.slice(0, 7).forEach(day => {
    const date = new Date(day.dt * 1000);
    const icon = day.weather[0].icon;
    forecastDiv.innerHTML += `
      <div class="day-card">
        <p>${date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
        <p>${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</p>
      </div>
    `;
  });
}

let hourlyChart;

function renderHourlyChart(hourly) {
  const hours = hourly.slice(0, 12).map(h => new Date(h.dt * 1000).getHours() + ":00");
  const temps = hourly.slice(0, 12).map(h => h.temp);

  if (hourlyChart) hourlyChart.destroy();

  hourlyChart = new Chart(hourlyChartCanvas, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Temp (°C)',
        data: temps,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#2196F3',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
