import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { LocationSuggestion } from '../types/weather';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onToggleSidebar
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 h-16 transition-colors duration-300">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center">
            <img
              src="/public/Weather_logo_1755539938783.png"
              alt="WeatherGrid"
              className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-300"
            />
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="relative p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
        >
          <div className="relative w-6 h-6">
            <Sun
              className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-500 transform ${
                isDarkMode ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <Moon
              className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 transform ${
                isDarkMode ? 'rotate-0 scale-100 opacity-100' : 'rotate-180 scale-0 opacity-0'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;