const DEFAULT_COORDS = {
    lat: 51.7189,
    lon: 8.7575,
    name: "Paderborn, DE"
};

function getWeatherDescription(code) {
    const map = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        61: "Rain",
        71: "Snow",
        95: "Thunderstorm"
    };
    return map[code] || "Unknown";
}

async function fetchWeather(lat, lon, locationName) {

    const tempEl = document.getElementById("weather-temp");
    const descEl = document.getElementById("weather-desc");
    const locEl = document.getElementById("weather-location");

    tempEl.textContent = "";
    descEl.textContent = "Loading...";
    locEl.textContent = locationName;

    try {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

        const res = await fetch(url);
        const data = await res.json();

        const current = data.current_weather;

        tempEl.textContent = Math.round(current.temperature) + "°C";
        descEl.textContent = getWeatherDescription(current.weathercode);

    } catch (err) {
        descEl.textContent = "Weather unavailable";
    }
}

export function initWeather() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                fetchWeather(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    "Your Location"
                );
            },
            () => {
                fetchWeather(
                    DEFAULT_COORDS.lat,
                    DEFAULT_COORDS.lon,
                    DEFAULT_COORDS.name
                );
            }
        );
    } else {
        fetchWeather(
            DEFAULT_COORDS.lat,
            DEFAULT_COORDS.lon,
            DEFAULT_COORDS.name
        );
    }
}
