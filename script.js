/* ============================================================
   CONFIG
   Get a free key at https://www.visualcrossing.com/weather-api
   This is a client-side-only project for learning purposes, so
   the key IS exposed in the bundle. That's expected and okay
   for this assignment (see the Odin instructions on API keys) —
   just don't do this for a real production app with a paid key.
   ============================================================ */
const API_KEY = "ZXZ4DAQ4FZXYJZZ4G4QNKTSEK";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
/* ============================================================
   DOM references
   ============================================================ */
const form = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location-input");
const unitToggle = document.querySelector("#unit-toggle");

const loadingEl = document.querySelector("#loading");
const errorEl = document.querySelector("#error");
const weatherEl = document.querySelector("#weather-display");
const emptyEl = document.querySelector("#empty-state");
const appEl = document.querySelector("#app");

const fields = {
  location: document.querySelector("#w-location"),
  icon: document.querySelector("#w-icon"),
  temp: document.querySelector("#w-temp"),
  unitLabel: document.querySelector("#w-unit-label"),
  condition: document.querySelector("#w-condition"),
  high: document.querySelector("#w-high"),
  low: document.querySelector("#w-low"),
  feelslike: document.querySelector("#w-feelslike"),
  humidity: document.querySelector("#w-humidity"),
  wind: document.querySelector("#w-wind"),
  uv: document.querySelector("#w-uv"),
};

/* ============================================================
   State
   `lastData` always holds the processed weather in Fahrenheit,
   the unit toggle just re-renders it converted — no need to
   hit the API again just to change units.
   ============================================================ */
let lastData = null;
let unit = "f"; // 'f' | 'c'

/* ============================================================
   Step 2: hit the API
   ============================================================ */
async function getWeatherData(location) {
  const url = `${BASE_URL}/${encodeURIComponent(
    location
  )}?unitGroup=us&key=${API_KEY}&contentType=json`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Couldn't find that location. Try a different search.");
    }
    throw new Error("Something went wrong fetching the weather.");
  }

  return response.json();
}

/* ============================================================
   Step 3: pull out only what the app needs
   Everything is stored in Fahrenheit/mph (the API's "us" unit
   group); convertTemp() below handles Celsius on display.
   ============================================================ */
function processWeatherData(raw) {
  const today = raw.days?.[0] ?? {};
  const current = raw.currentConditions ?? {};

  return {
    resolvedLocation: raw.resolvedAddress,
    tempF: current.temp ?? today.temp,
    feelslikeF: current.feelslike ?? today.feelslike,
    highF: today.tempmax,
    lowF: today.tempmin,
    humidity: current.humidity ?? today.humidity,
    windSpeedMph: current.windspeed ?? today.windspeed,
    uvIndex: current.uvindex ?? today.uvindex,
    condition: current.conditions ?? today.conditions,
    icon: current.icon ?? today.icon,
  };
}

/* ============================================================
   Unit conversion + formatting helpers
   ============================================================ */
function fToC(f) {
  return ((f - 32) * 5) / 9;
}

function formatTemp(f) {
  const value = unit === "f" ? f : fToC(f);
  return Math.round(value);
}

/* Map the API's icon string to an emoji + a theme key our CSS understands */
const ICON_MAP = {
  "clear-day": { emoji: "☀️", theme: "clear-day" },
  "clear-night": { emoji: "🌙", theme: "clear-night" },
  "partly-cloudy-day": { emoji: "⛅", theme: "partly-cloudy-day" },
  "partly-cloudy-night": { emoji: "☁️", theme: "partly-cloudy-night" },
  cloudy: { emoji: "☁️", theme: "cloudy" },
  fog: { emoji: "🌫️", theme: "fog" },
  wind: { emoji: "🌬️", theme: "wind" },
  rain: { emoji: "🌧️", theme: "rain" },
  "showers-day": { emoji: "🌦️", theme: "rain" },
  "showers-night": { emoji: "🌧️", theme: "rain" },
  snow: { emoji: "❄️", theme: "snow" },
  "thunder-rain": { emoji: "⛈️", theme: "thunderstorm" },
  "thunder-showers-day": { emoji: "⛈️", theme: "thunderstorm" },
  "thunder-showers-night": { emoji: "⛈️", theme: "thunderstorm" },
};

function iconFor(iconKey) {
  return ICON_MAP[iconKey] ?? { emoji: "🌡️", theme: "default" };
}

/* ============================================================
   Rendering
   ============================================================ */
function renderWeather(data) {
  const { emoji, theme } = iconFor(data.icon);

  fields.location.textContent = data.resolvedLocation;
  fields.icon.textContent = emoji;
  fields.temp.textContent = formatTemp(data.tempF);
  fields.unitLabel.textContent = unit === "f" ? "°F" : "°C";
  fields.condition.textContent = data.condition ?? "—";
  fields.high.textContent = `H: ${formatTemp(data.highF)}°`;
  fields.low.textContent = `L: ${formatTemp(data.lowF)}°`;
  fields.feelslike.textContent = `${formatTemp(data.feelslikeF)}°`;
  fields.humidity.textContent =
    data.humidity != null ? `${Math.round(data.humidity)}%` : "—";
  fields.wind.textContent =
    data.windSpeedMph != null ? `${Math.round(data.windSpeedMph)} mph` : "—";
  fields.uv.textContent = data.uvIndex ?? "—";

  appEl.dataset.condition = theme;
  weatherEl.hidden = false;
  emptyEl.hidden = true;
  unitToggle.disabled = false;
}

function showLoading(isLoading) {
  loadingEl.hidden = !isLoading;
  if (isLoading) {
    errorEl.hidden = true;
  }
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  weatherEl.hidden = true;
  emptyEl.hidden = true;
}

/* ============================================================
   Step 4 & 5: wire up the form and the unit toggle
   ============================================================ */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const location = locationInput.value.trim();
  if (!location) return;

  showLoading(true);

  try {
    const raw = await getWeatherData(location);
    const processed = processWeatherData(raw);

    console.log(raw); // raw API payload, per assignment step 2
    console.log(processed); // trimmed-down data, per assignment step 3

    lastData = processed;
    renderWeather(processed);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
});

unitToggle.addEventListener("click", () => {
  unit = unit === "f" ? "c" : "f";
  unitToggle.textContent = unit === "f" ? "°F" : "°C";
  if (lastData) renderWeather(lastData);
});
