# WeatherGrid
A fast, mobile-first weather dashboard that shows live conditions, 24-hour (from Now) and 7-day forecasts and other Weather Output. It supports smart city search with autocomplete, saved & home locations, recent searches, dark/light mode, and a polished UI.

## Key Features
Current Weather Card with location, date/time, sunrise/sunset, feels like, humidity, wind, visibility, and chance of rain.

24-Hour Forecast that always starts at the current hour; sun / moon icons adapt to day/night.

7-Day Forecast with dark/light adaptive styling.

Recent Searches (last 5) — click to paste into the search box and press Enter to fetch.

Use Current Location with proper permission handling and clear errors.

Theme Toggle (dark/light) applied across the entire app.

## Getting Started
Install
```bash
npm install
```
Run Dev
```bash
npm run dev
```
Build
```bash
npm run build
```
## Live Link
[Click Here](https://weathergridapp.netlify.app/)

## Screenshots (Examples)

<img width="1874" height="896" alt="Screenshot 2025-08-22 220416" src="https://github.com/user-attachments/assets/3f882ce9-655c-46e8-8693-d51951c693a0" />


<img width="1886" height="908" alt="Screenshot 2025-08-22 220516" src="https://github.com/user-attachments/assets/68e9e37e-77ee-4ad9-855d-2c3a96ccbd00" />



## Tech Satck

Frontend: React + TypeScript (Vite)

Weather: WeatherAPI (forecast + AQI)

Geocoding: OpenCage (autocomplete + lat/lon)

Icons: Material / Lucide / Weather Icons
