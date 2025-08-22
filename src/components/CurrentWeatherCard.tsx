import React from 'react';
import { MapPin, Calendar, Sunrise, Sunset, CloudRain } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  isDark: boolean;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, isDark }) => {
  const getWeatherIconUrl = (icon: string) => {
    return `https://cdn.weatherapi.com/weather/64x64/day/${icon}.png`;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const windSpeedKmh = (weather.wind_spd * 3.6).toFixed(1); // Convert m/s to km/h

  return (
    <div className={`rounded-2xl p-8 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-blue-600 to-purple-700' 
        : 'bg-gradient-to-br from-blue-400 to-purple-500'
    } text-white`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="text-lg font-medium truncate">
              {weather.city_name}, {weather.country_code}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end space-x-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-bold">{currentDate}</span>
            </div>
            <div className="text-sm font-bold mt-1">
              {currentTime}
            </div>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <img
              src={getWeatherIconUrl(weather.weather.icon)}
              alt={weather.weather.description}
              className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
            />
            <div>
              <div className="text-4xl sm:text-6xl font-bold mb-2">
                {Math.round(weather.temp)}°
              </div>
              <div className="text-lg sm:text-xl opacity-80 capitalize mb-1">
                {weather.weather.description}
              </div>
              <div className="text-sm opacity-70">
                Feels like {Math.round(weather.app_temp)}°
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex lg:flex-col space-x-6 lg:space-x-0 lg:space-y-4 lg:text-right">
            <div className="flex items-center space-x-2 lg:justify-end">
              <Sunrise className="w-4 h-4" />
              <span className="text-sm">6:30 AM</span>
            </div>
            <div className="flex items-center space-x-2 lg:justify-end">
              <Sunset className="w-4 h-4" />
              <span className="text-sm">7:45 PM</span>
            </div>
            <div className="flex items-center space-x-2 lg:justify-end">
              <CloudRain className="w-4 h-4" />
              <span className="text-sm">{weather.pop || 0}% rain</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{weather.rh}%</div>
            <div className="text-xs sm:text-sm opacity-70">Humidity</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{windSpeedKmh}</div>
            <div className="text-xs sm:text-sm opacity-70">Wind (km/h)</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{weather.vis}</div>
            <div className="text-xs sm:text-sm opacity-70">Visibility (km)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;