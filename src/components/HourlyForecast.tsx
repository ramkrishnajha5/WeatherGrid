import React from 'react';
import { HourlyWeather } from '../types/weather';

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const now = new Date();
  const currentHour = now.getHours();

  // Create 24-hour forecast starting from current hour
  const get24HourForecast = () => {
    if (!hourlyData || hourlyData.length === 0) return [];

    const forecast = [];
    const currentTime = new Date();

    for (let i = 0; i < 24; i++) {
      const forecastTime = new Date(currentTime.getTime() + (i * 60 * 60 * 1000));
      const forecastHour = forecastTime.getHours();

      // Find the closest data point for this hour
      const dataPoint = hourlyData.find(item => {
        const itemTime = new Date(item.timestamp_local || item.timestamp_utc);
        return itemTime.getHours() === forecastHour;
      }) || hourlyData[Math.min(i, hourlyData.length - 1)];

      forecast.push({
        ...dataPoint,
        forecastTime,
        isCurrentHour: i === 0
      });
    }

    return forecast;
  };

  const forecast24Hours = get24HourForecast();

  if (!forecast24Hours.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          24-Hour Forecast
        </h3>
        <p className="text-gray-500 dark:text-gray-400">No hourly data available</p>
      </div>
    );
  }

  const getCustomIcon = (hour: number) => {
    // Show sun icon between 05:00–17:00, moon icon between 18:00–04:00
    const isDayTime = hour >= 5 && hour <= 17;

    if (isDayTime) {
      // Sun icon (Unicode or emoji)
      return '☀️';
    } else {
      // Moon icon (Unicode or emoji)
      return '🌙';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        24-Hour Forecast
      </h3>

      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max">
          {forecast24Hours.map((item, index) => {
            const hour = item.forecastTime.getHours();
            const isCurrentHour = item.isCurrentHour;

            let displayTime: string;
            if (isCurrentHour) {
              displayTime = "Now";
            } else {
              displayTime = hour === 0 ? '12 AM' :
                          hour === 12 ? '12 PM' :
                          hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
            }

            const temp = Math.round(item.temp || 0);

            return (
              <div
                key={index}
                className={`flex-none text-center w-20 p-3 rounded-lg transition-all duration-200 ${
                  isCurrentHour
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <p className={`text-sm mb-2 ${
                  isCurrentHour
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {displayTime}
                </p>

                <div className="flex justify-center mb-2">
                  <span
                    className="text-3xl"
                    title={item.weather?.description || 'Weather'}
                  >
                    {getCustomIcon(hour)}
                  </span>
                </div>

                <p className={`text-lg font-medium ${
                  isCurrentHour
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-white'
                }`}>
                  {temp}°
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {item.weather?.description || 'Clear'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;