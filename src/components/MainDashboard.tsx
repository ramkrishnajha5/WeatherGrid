
import React, { useState, useEffect } from 'react';
import CurrentWeatherCard from './CurrentWeatherCard';
import WeatherMetricsGrid from './WeatherMetricsGrid';
import ForecastChart from './ForecastChart';
import TodayHighlights from './TodayHighlights';
import HourlyForecast from './HourlyForecast';

import LoadingSpinner from './LoadingSpinner';
import { WeatherData, ForecastDay, LocationSuggestion, HourlyWeather } from '../types/weather';
import { getCurrentWeather, getWeatherForecast } from '../services/weatherApi';

interface MainDashboardProps {
  location: LocationSuggestion;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        const [weatherResponse, forecastResponse] = await Promise.all([
          getCurrentWeather(location.lat, location.lng),
          getWeatherForecast(location.lat, location.lng)
        ]);

        if (weatherResponse.data && weatherResponse.data.length > 0) {
          setWeather(weatherResponse.data[0]);
        }

        if (weatherResponse.hourly) {
          setHourlyWeather(weatherResponse.hourly);
        }

        if (forecastResponse.data && forecastResponse.data.length > 0) {
          setForecast(forecastResponse.data);
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        
        if (retryCount < 2 && (errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('Network error'))) {
          // Retry after a delay for rate limit or network errors
          setTimeout(() => {
            fetchWeatherData(retryCount + 1);
          }, 2000 * (retryCount + 1));
          return;
        }
        
        if (errorMessage.includes('429')) {
          setError('Weather service is temporarily busy. Please try again in a few minutes.');
        } else if (errorMessage.includes('503')) {
          setError('Weather service is temporarily unavailable. Please try again later.');
        } else if (errorMessage.includes('Network error')) {
          setError('Unable to connect to weather service. Please check your internet connection.');
        } else {
          setError('Failed to load weather data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-gray-400">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Top Row - Current Weather and Quick Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-top duration-700">
        <div className="xl:col-span-2 transform transition-all duration-300 hover:scale-[1.01]">
          <CurrentWeatherCard weather={weather} />
        </div>
        <div className="xl:col-span-1 transform transition-all duration-300 hover:scale-[1.01]">
          <WeatherMetricsGrid weather={weather} />
        </div>
      </div>

      {/* Hourly Forecast */}
      {hourlyWeather.length > 0 && (
        <div className="animate-in slide-in-from-bottom duration-700 delay-300">
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <HourlyForecast hourlyData={hourlyWeather} />
          </div>
        </div>
      )}

      {/* Mobile Layout - Today's Highlights first, then Forecast */}
      <div className="block lg:hidden space-y-6 animate-in slide-in-from-bottom duration-700 delay-400">
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <TodayHighlights weather={weather} />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <ForecastChart forecast={forecast} />
        </div>
        
      </div>

      {/* Desktop Layout - Forecast first, then Today's Highlights */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700 delay-400">
        <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-[1.01]">
          <ForecastChart forecast={forecast} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <TodayHighlights weather={weather} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
