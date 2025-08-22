import React, { useState } from 'react';
import { X, Home, Trash2, Clock, Globe, MapPin, Navigation } from 'lucide-react';
import SearchBar from './SearchBar';
import { LocationSuggestion } from '../types/weather';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: LocationSuggestion[];
  onLocationSelect: (location: LocationSuggestion) => void;
  onLocationAdd: (location: LocationSuggestion) => void;
  onLocationRemove: (location: LocationSuggestion) => void;
  onSetHome: (location: LocationSuggestion) => void;
  homeCity: LocationSuggestion | null;
  recentSearches: string[];
  onSearchQuery: (query: string) => void;
  onRecentSearchClick?: (searchTerm: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  savedLocations,
  onLocationSelect,
  onLocationAdd,
  onLocationRemove,
  onSetHome,
  homeCity,
  recentSearches,
  onSearchQuery,
  onRecentSearchClick
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation: LocationSuggestion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          formatted: 'Current Location',
          components: {
            city: 'Current Location',
            country: ''
          }
        };
        onLocationAdd(currentLocation);
        onLocationSelect(currentLocation);
        setIsGettingLocation(false);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = 'Location permission denied';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const formatLocationName = (location: LocationSuggestion): { main: string; sub: string } => {
    if (location.formatted === 'Current Location') {
      return { main: 'Current Location', sub: '' };
    }

    const { components } = location;
    const city = components.city || components.town || components.village || components.hamlet;
    const state = components.state || components.state_code;
    const country = components.country;

    let main = city || 'Loading...';
    let sub = '';

    if (state && state !== city) sub += state;
    if (country && country !== state) {
      if (sub) sub += ', ';
      sub += country;
    }

    return { main, sub };
  };

  const popularCities: LocationSuggestion[] = [
    {
      lat: 40.7128,
      lng: -74.0060,
      formatted: 'New York, NY, USA',
      components: { city: 'New York', state: 'NY', country: 'USA' }
    },
    {
      lat: 51.5074,
      lng: -0.1278,
      formatted: 'London, UK',
      components: { city: 'London', country: 'UK' }
    },
    {
      lat: 48.8566,
      lng: 2.3522,
      formatted: 'Paris, France',
      components: { city: 'Paris', country: 'France' }
    },
    {
      lat: 35.6762,
      lng: 139.6503,
      formatted: 'Tokyo, Japan',
      components: { city: 'Tokyo', country: 'Japan' }
    },
    {
      lat: 25.2048,
      lng: 55.2708,
      formatted: 'Dubai, UAE',
      components: { city: 'Dubai', country: 'UAE' }
    },
    {
      lat: 28.6139,
      lng: 77.2090,
      formatted: 'New Delhi, India', // Changed from Delhi to New Delhi
      components: { city: 'New Delhi', country: 'India' }
    },
    {
      lat: 39.9042,
      lng: 116.4074,
      formatted: 'Beijing, China',
      components: { city: 'Beijing', country: 'China' }
    }
  ];

  // Function to handle clicks on recent search items or popular cities
  const handleItemClick = (searchTerm: string) => {
    setSearchQuery(searchTerm); // Update local state for search query
    // Always call onRecentSearchClick if provided, which should handle the search
    if (onRecentSearchClick) {
      onRecentSearchClick(searchTerm);
    }
    // Also trigger the search query to add to recent searches
    onSearchQuery(searchTerm);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200 lg:dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weather Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <SearchBar
              onLocationAdd={onLocationAdd}
              onSearchQuery={onSearchQuery}
              showActionButtons={false}
              searchQuery={searchQuery} // Pass local searchQuery state
              setSearchQuery={setSearchQuery} // Pass setter for SearchBar to control input
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Use Current Location Button */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:cursor-not-allowed"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Getting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Use Current Location</span>
                  </>
                )}
              </button>
              {locationError && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg animate-in fade-in duration-300">
                  {locationError}
                </div>
              )}
            </div>

            {/* Saved Locations */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Saved Locations {savedLocations.length > 0 && <span className="text-xs">({savedLocations.length}/5)</span>}
                </h3>
              </div>
              {savedLocations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No saved locations yet
                </p>
              ) : (
                <div className="space-y-2">
                  {savedLocations.map((location, index) => {
                    const isHome = homeCity && homeCity.lat === location.lat && homeCity.lng === location.lng;
                    const { main, sub } = formatLocationName(location);
                    return (
                      <div
                        key={index}
                        className="group p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                        onClick={() => onLocationSelect(location)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {main}
                              </p>
                              {isHome && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                  Home
                                </span>
                              )}
                            </div>
                            {sub && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {sub}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!isHome && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSetHome(location);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-150"
                                title="Set as Home"
                              >
                                <Home className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLocationRemove(location);
                              }}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-150"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Searches */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Searches
                </h3>
              </div>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent searches
                </p>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleItemClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Cities */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Popular Cities
                </h3>
              </div>
              <div className="space-y-2">
                {popularCities.map((city, index) => {
                  const { main, sub } = formatLocationName(city);
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => handleItemClick(city.components.city || city.formatted)}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {main}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sub}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;