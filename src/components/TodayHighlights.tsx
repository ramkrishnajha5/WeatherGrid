
import React from 'react';
import { Droplets, Thermometer, Wind, Sun, Gauge } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getAirQualityLevel } from '../services/weatherApi';

interface TodayHighlightsProps {
  weather: WeatherData;
}

const TodayHighlights: React.FC<TodayHighlightsProps> = ({ weather }) => {
  const getUVIndexLevel = (uv: number): { level: string; color: string } => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-600' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-600' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const uvIndex = getUVIndexLevel(weather.uv);
  const airQuality = weather.air_quality ? getAirQualityLevel(weather.air_quality['us-epa-index']) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Today's Highlights
      </h3>

      <div className="space-y-4">
        {/* Feels Like */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transform transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-6 h-6 text-blue-500" />
            <span className="text-base font-medium text-gray-900 dark:text-white">Feels like</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round(weather.app_temp)}°C
          </span>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transform transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-blue-500" />
            <span className="text-base font-medium text-gray-900 dark:text-white">Humidity</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {weather.rh}%
          </span>
        </div>

        {/* Wind */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transform transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center space-x-3">
            <Wind className="w-6 h-6 text-blue-500" />
            <span className="text-base font-medium text-gray-900 dark:text-white">Wind</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {(weather.wind_spd * 3.6).toFixed(1)} km/h
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getWindDirection(weather.wind_dir)}
            </p>
          </div>
        </div>

        {/* UV Index */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transform transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center space-x-3">
            <Sun className="w-6 h-6 text-yellow-500" />
            <span className="text-base font-medium text-gray-900 dark:text-white">UV Index</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {weather.uv}
            </span>
            <p className={`text-sm ${uvIndex.color}`}>
              {uvIndex.level}
            </p>
          </div>
        </div>

        {/* Air Quality */}
        {airQuality && weather.air_quality && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transform transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center space-x-3">
              <Gauge className="w-6 h-6 text-blue-500" />
              <span className="text-base font-medium text-gray-900 dark:text-white">Air Quality</span>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {weather.air_quality['us-epa-index']}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AQI</p>
                </div>
                {weather.air_quality.pm2_5 && (
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.round(weather.air_quality.pm2_5)}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PM2.5</p>
                  </div>
                )}
              </div>
              <p className={`text-sm ${airQuality.color.replace('text-', '')}`}>
                {airQuality.level}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayHighlights;
