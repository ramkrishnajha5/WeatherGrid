
import { WeatherResponse, ForecastResponse, LocationSuggestion, HourlyWeather, AirQuality } from '../types/weather';

// Live API keys
const OPENCAGE_API_KEY = '12884dfb18704135aefb1d57c02b9d48';
const WEATHER_API_KEY = '08d87bbce091441681e170614251808';

export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&limit=10`
  );

  if (!response.ok) {
    throw new Error('Failed to search locations');
  }

  const data = await response.json();

  return data.results.map((result: any) => ({
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    formatted: result.formatted,
    components: result.components
  }));
};

export const getCurrentWeather = async (lat: number, lng: number): Promise<WeatherResponse> => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=7&aqi=yes&alerts=no`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Weather service is temporarily busy. Please try again in a few minutes.');
      } else if (response.status === 503) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Transform WeatherAPI response to match our existing structure
    const transformedData = {
      data: [{
        city_name: data.location.name,
        country_code: data.location.country,
        temp: data.current.temp_c,
        app_temp: data.current.feelslike_c,
        weather: {
          icon: data.current.condition.icon.split('/').pop()?.replace('.png', '') || 'unknown',
          code: data.current.condition.code,
          description: data.current.condition.text
        },
        rh: data.current.humidity,
        uv: data.current.uv,
        vis: data.current.vis_km,
        wind_spd: data.current.wind_kph / 3.6, // Convert km/h to m/s to match existing logic
        wind_dir: data.current.wind_degree,
        precip: data.current.precip_mm,
        snow: 0, // WeatherAPI doesn't provide separate snow field
        pop: data.forecast.forecastday[0].day.daily_chance_of_rain,
        air_quality: data.current.air_quality
      }],
      hourly: data.forecast.forecastday[0].hour.map((hour: any) => ({
        time: hour.time,
        temp: hour.temp_c,
        condition: hour.condition.text,
        icon: hour.condition.icon.split('/').pop()?.replace('.png', '') || 'unknown',
        wind_kph: hour.wind_kph,
        humidity: hour.humidity,
        chance_of_rain: hour.chance_of_rain
      }))
    };

    return transformedData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to weather service');
    }
    throw error;
  }
};

export const getWeatherForecast = async (lat: number, lng: number): Promise<ForecastResponse> => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=7&aqi=yes&alerts=no`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform WeatherAPI forecast response
    const transformedData = {
      data: data.forecast.forecastday.map((day: any) => ({
        datetime: day.date,
        temp: day.day.avgtemp_c,
        min_temp: day.day.mintemp_c,
        max_temp: day.day.maxtemp_c,
        weather: {
          icon: day.day.condition.icon.split('/').pop()?.replace('.png', '') || 'unknown',
          description: day.day.condition.text
        },
        pop: day.day.daily_chance_of_rain
      }))
    };

    return transformedData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to weather service');
    }
    throw error;
  }
};

export const getAirQualityLevel = (aqiValue: number): { level: string; color: string } => {
  if (aqiValue <= 50) return { level: 'Very Good', color: 'text-green-600' };
  if (aqiValue <= 100) return { level: 'Good', color: 'text-green-400' };
  if (aqiValue <= 150) return { level: 'Moderate', color: 'text-orange-500' };
  if (aqiValue <= 200) return { level: 'Bad', color: 'text-red-500' };
  return { level: 'Very Bad', color: 'text-red-700' };
};
