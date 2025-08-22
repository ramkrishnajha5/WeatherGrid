import React from 'react';
import { Calendar } from 'lucide-react';
import { ForecastDay } from '../types/weather';

interface ForecastProps {
  forecast: ForecastDay[];
}

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const getWeatherIconUrl = (icon: string) => {
    return `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-white" />
        <h3 className="text-xl font-semibold text-white">7-Day Forecast</h3>
      </div>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-white font-medium min-w-[80px]">
                {formatDate(day.datetime)}
              </div>
              <img
                src={getWeatherIconUrl(day.weather.icon)}
                alt={day.weather.description}
                className="w-10 h-10"
              />
              <div className="text-white/80 text-sm capitalize flex-1">
                {day.weather.description}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <span className="text-white/60 text-sm">
                {Math.round(day.min_temp)}°
              </span>
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                  style={{ 
                    width: `${((day.max_temp - day.min_temp) / 20) * 100}%`,
                    marginLeft: `${((day.min_temp + 10) / 40) * 100}%`
                  }}
                />
              </div>
              <span className="font-semibold min-w-[40px] text-right">
                {Math.round(day.max_temp)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;