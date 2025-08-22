import React from 'react';
import { MapPin, Thermometer } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const getWeatherIconUrl = (icon: string) => {
    return `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 text-white/80 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">
            {weather.city_name}, {weather.country_code}
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <img
            src={getWeatherIconUrl(weather.weather.icon)}
            alt={weather.weather.description}
            className="w-20 h-20"
          />
          <div className="text-left">
            <div className="text-5xl font-bold text-white mb-1">
              {Math.round(weather.temp)}°
            </div>
            <div className="text-white/80 text-sm capitalize">
              {weather.weather.description}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 text-white/80">
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Feels like {Math.round(weather.app_temp)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;