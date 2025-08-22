export interface WeatherData {
  city_name: string;
  country_code: string;
  temp: number;
  app_temp: number;
  weather: {
    icon: string;
    code: number;
    description: string;
  };
  rh: number;
  uv: number;
  vis: number;
  wind_spd: number;
  wind_dir: number;
  precip: number;
  snow: number;
  pop: number; // Probability of precipitation
  air_quality?: AirQuality;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  wind_kph: number;
  humidity: number;
  chance_of_rain: number;
}

export interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number;
  'gb-defra-index': number;
}

export interface ForecastDay {
  datetime: string;
  temp: number;
  min_temp: number;
  max_temp: number;
  weather: {
    icon: string;
    description: string;
  };
  pop: number; // Probability of precipitation
}

export interface WeatherResponse {
  data: WeatherData[];
  hourly?: HourlyWeather[];
}

export interface ForecastResponse {
  data: ForecastDay[];
}

export interface LocationSuggestion {
  lat: number;
  lng: number;
  formatted: string;
  components: {
    city?: string;
    country?: string;
    state?: string;
   };
}

export interface SavedLocation {
  lat: number;
  lng: number;
  name: string;
  isHome?: boolean;
}