import React from 'react';
import { Thermometer, Droplets, Wind, Eye, CloudRain } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  isDark: boolean;
}

const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather, isDark }) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const windSpeedKmh = (weather.wind_spd * 3.6).toFixed(1); // Convert m/s to km/h

  const metrics = [
    {
      icon: Thermometer,
      label: 'Real Feel',
      value: `${Math.round(weather.app_temp)}°`,
      color: 'from-red-500 to-orange-500',
      bgColor: isDark ? 'bg-red-500/20' : 'bg-red-100',
      iconColor: isDark ? 'text-red-400' : 'text-red-600'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.rh}%`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      iconColor: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${windSpeedKmh} km/h`,
      subtitle: getWindDirection(weather.wind_dir),
      color: 'from-green-500 to-teal-500',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100',
      iconColor: isDark ? 'text-green-400' : 'text-green-600'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.vis} km`,
      color: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
      iconColor: isDark ? 'text-purple-400' : 'text-purple-600'
    },
    {
      icon: CloudRain,
      label: 'Chance of Rain',
      value: `${weather.pop || 0}%`,
      color: 'from-indigo-500 to-blue-500',
      bgColor: isDark ? 'bg-indigo-500/20' : 'bg-indigo-100',
      iconColor: isDark ? 'text-indigo-400' : 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className={`rounded-xl p-4 border transition-all duration-200 ${
              isDark 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {metric.label}
                  </div>
                  <div className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <div className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {metric.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherMetricsGrid;