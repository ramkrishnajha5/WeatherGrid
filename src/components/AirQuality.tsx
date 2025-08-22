
import React from 'react';
import { Wind } from 'lucide-react';
import { AirQuality as AirQualityType } from '../types/weather';
import { getAirQualityLevel } from '../services/weatherApi';

interface AirQualityProps {
  airQuality: AirQualityType;
}

const AirQuality: React.FC<AirQualityProps> = ({ airQuality }) => {
  const aqiValue = airQuality['us-epa-index'];
  const { level, color } = getAirQualityLevel(aqiValue);

  const getBackgroundColor = (level: string) => {
    switch (level) {
      case 'Very Good': return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Good': return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800';
      case 'Moderate': return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'Bad': return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'Very Bad': return 'bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 ${getBackgroundColor(level)}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Wind className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Air Quality
        </h3>
      </div>

      <div className="space-y-4">
        {/* AQI Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {aqiValue}
          </div>
          <div className={`text-lg font-medium ${color}`}>
            {level}
          </div>
        </div>

        {/* Pollutant Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">PM2.5</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {airQuality.pm2_5.toFixed(1)} μg/m³
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">PM10</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {airQuality.pm10.toFixed(1)} μg/m³
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">NO2</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {airQuality.no2.toFixed(1)} μg/m³
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">O3</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {airQuality.o3.toFixed(1)} μg/m³
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;
