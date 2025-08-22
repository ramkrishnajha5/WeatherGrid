import React from 'react';
import { Droplets, Eye, Sun, Wind, CloudRain, Snowflake } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherMetricsProps {
  weather: WeatherData;
}

const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const metrics = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.rh}%`,
      color: 'text-blue-400'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.vis} km`,
      color: 'text-green-400'
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: weather.uv.toFixed(1),
      color: 'text-yellow-400'
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${weather.wind_spd.toFixed(1)} m/s ${getWindDirection(weather.wind_dir)}`,
      color: 'text-gray-400'
    },
    {
      icon: CloudRain,
      label: 'Precipitation',
      value: `${weather.precip} mm`,
      color: 'text-blue-500'
    },
    {
      icon: Snowflake,
      label: 'Snow',
      value: `${weather.snow} mm`,
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white/20 ${metric.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white/60 text-xs font-medium uppercase tracking-wide">
                  {metric.label}
                </div>
                <div className="text-white text-lg font-semibold">
                  {metric.value}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherMetrics;