import React from 'react';
import { Calendar, TrendingUp, CloudRain } from 'lucide-react';
import { ForecastDay } from '../types/weather';

interface ForecastChartProps {
  forecast: ForecastDay[];
  isDark: boolean;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, isDark }) => {
  const getWeatherIconUrl = (icon: string) => {
    return `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  };

  // Function to get weather icon component (assuming you have this defined elsewhere or will define it)
  // For the purpose of this change, we'll assume `getWeatherIcon` is available and correctly returns an icon component.
  // If it's not provided, the icon will not be displayed due to the conditional rendering.
  const getWeatherIcon = (iconCode: string) => {
    // This is a placeholder. Replace with your actual icon mapping logic.
    // For example:
    // if (iconCode.startsWith('01')) return <Sun />;
    // if (iconCode.startsWith('10')) return <CloudRain />;
    // etc.
    // If iconCode is not recognized, return null or a default icon.
    // For this example, we'll just return an img tag as per the original structure,
    // but the new logic will handle cases where the icon itself might be missing or invalid.

    // Assuming getWeatherIconUrl is the only way to get the icon, and it's used in the img tag.
    // The change targets the `getWeatherIcon` usage which implies `getWeatherIcon` might be a component renderer.
    // Let's assume `getWeatherIcon` returns a React element. If `day.weather.icon` is present, it's used.
    // The provided change snippet implies `getWeatherIcon` is a function that returns a JSX element.
    // We will keep the `getWeatherIconUrl` as it is, and assume `getWeatherIcon` handles the actual icon rendering based on the `icon` string.
    // The crucial part of the change is the conditional rendering `day.weather.icon && (...)`
    // So, `getWeatherIcon` itself should be able to handle the `icon` string.
    // For now, to make this snippet runnable, we'll create a dummy `getWeatherIcon` that uses `getWeatherIconUrl`.
    // In a real scenario, this function would be defined in the same file or imported.

    // Dummy implementation for `getWeatherIcon` to make the provided snippet valid:
    if (!iconCode) return null;
    return (
      <img
        src={getWeatherIconUrl(iconCode)}
        alt={iconCode} // Use iconCode as alt text if description is not available here
        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" // Match original image size
      />
    );
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

  const maxTemp = Math.max(...forecast.map(day => day.max_temp));
  const minTemp = Math.min(...forecast.map(day => day.min_temp));
  const tempRange = maxTemp - minTemp;

  return (
    <div className={`rounded-2xl p-6 border ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            7-Day Forecast
          </h3>
        </div>
        <div className={`flex items-center space-x-2 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <TrendingUp className="w-4 h-4" />
          <span>Temperature Trend</span>
        </div>
      </div>

      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
              isDark
                ? 'bg-gray-700/50 hover:bg-gray-700'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`font-medium min-w-[80px] sm:min-w-[100px] ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {formatDate(day.datetime)}
              </div>
              {/* The change is applied here: conditionally render the icon */}
              {day.weather.icon && (
                <img
                  src={getWeatherIconUrl(day.weather.icon)}
                  alt={day.weather.description}
                  className="w-10 h-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-sm capitalize truncate ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {day.weather.description}
                </div>
                <div className={`flex items-center space-x-1 text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <CloudRain className="w-3 h-3" />
                  <span>{day.pop || 0}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className={`text-sm min-w-[30px] sm:min-w-[35px] ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {Math.round(day.min_temp)}°
                </span>

                {/* Temperature Range Bar */}
                <div className={`relative w-16 sm:w-24 h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}>
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full"
                    style={{
                      width: `${tempRange > 0 ? ((day.max_temp - day.min_temp) / tempRange) * 100 : 100}%`,
                      left: `${tempRange > 0 ? ((day.min_temp - minTemp) / tempRange) * 100 : 0}%`
                    }}
                  />
                </div>

                <span className={`font-semibold min-w-[30px] sm:min-w-[35px] text-right ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.round(day.max_temp)}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;