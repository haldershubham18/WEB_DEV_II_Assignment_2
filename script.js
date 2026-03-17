const API_KEY = "fe49032660686b84d876d6a5f4ef1191";

const form = document.querySelector("#form");
const cityInput = document.querySelector("#city");
const weatherInfo = document.querySelector(".info");
const historyContainer = document.querySelector(".historyBtn");

let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const searchCity = cityInput.value.trim();
    if (!searchCity) {
        weatherInfo.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`);
        const data = await res.json();

        if (data.cod == 200) {
            weatherInfo.innerHTML = `
                <p>City: ${data.name}</p>
                <p>Temp: ${(data.main.temp - 273.15).toFixed(1)}°C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${data.wind.speed} m/s</p>
            `;
            
            cityHistory.push(searchCity);
            cityHistory = [...new Set(cityHistory)]; 
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
            displayHistory();
        } else {
            weatherInfo.innerHTML = `<p>City not found.</p>`;
        }
    } catch (error) {
        console.error(error);
        weatherInfo.innerHTML = `<p>Error fetching weather data.</p>`;
    }
});

function displayHistory() {
    historyContainer.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("cityHistory")) || [];
    history.forEach((city) => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.addEventListener("click", () => {
            cityInput.value = city;
            form.dispatchEvent(new Event("submit")); 
        });
        historyContainer.appendChild(btn);
    });
}

displayHistory();