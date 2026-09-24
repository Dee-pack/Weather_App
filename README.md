# Weather App

A vanilla HTML/CSS/JS weather app built for The Odin Project's Weather App assignment.

## Setup

1. Get a free API key from [Visual Crossing](https://www.visualcrossing.com/weather-api).
2. Open `script.js` and replace `YOUR_API_KEY_HERE` with your key.
3. Open `index.html` in a browser (or serve the folder with something like
   `npx live-server` / the VS Code "Live Server" extension). This project has no
   build step, so no `npm install` is needed.

## How it's organized

- `index.html` — markup only: the search form, unit toggle, and the empty/loading/
  error/weather states that get shown or hidden.
- `style.css` — layout and a set of `data-condition` theme blocks. `script.js` sets
  `data-condition` on the `<main>` element based on the weather returned, and the
  accent color + background gradient swap accordingly.
- `script.js`:
  - `getWeatherData(location)` — hits the Visual Crossing API, `async/await`, throws
    on a bad response.
  - `processWeatherData(raw)` — trims the API's large payload down to the handful
    of fields the UI actually uses, always in Fahrenheit.
  - `renderWeather(data)` — writes that data into the DOM, converting to Celsius on
    the fly if the toggle is set to °C (no second API call needed to switch units).
  - `showLoading` / `showError` — the loading spinner and error states.

## Ideas to extend it

- Add a multi-day forecast strip using `raw.days` (currently only `days[0]` is used).
- Swap the emoji icons for real SVG/PNG weather icons — this is where the Odin
  instructions mention dynamic imports being useful once you're bundling assets
  with Webpack.
- Debounce the location input and add autocomplete suggestions.
- Persist the last-searched location in `localStorage` so it loads on return visits.
- Remember: this project intentionally exposes the API key client-side, which is
  fine for a free/learning key but not for anything you'd ship for real — that's
  what the backend courses cover later.
