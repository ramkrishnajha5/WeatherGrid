import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocations } from '../services/weatherApi';
import { LocationSuggestion } from '../types/weather';

interface SearchBarProps {
  onLocationAdd: (location: LocationSuggestion) => void;
  onSearchQuery: (query: string) => void;
  showActionButtons?: boolean;
  initialQuery?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export interface SearchBarRef {
  setSearchQuery: (query: string) => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ onLocationAdd, showActionButtons = true, onSearchQuery, initialQuery = '', searchQuery, setSearchQuery: externalSetSearchQuery }, ref) => {
  const [query, setQuery] = useState(searchQuery || initialQuery);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    } else {
      setQuery(initialQuery);
    }
  }, [initialQuery, searchQuery]);

  useImperativeHandle(ref, () => ({
    setSearchQuery: (newQuery: string) => {
      setQuery(newQuery);
      // Trigger search when Enter is pressed or after a short delay
      setTimeout(() => {
        if (newQuery.trim().length >= 3) {
          searchLocations(newQuery).then(results => {
            if (results.length > 0) {
              handleLocationSelect(results[0]); // Select first result
            }
          }).catch(error => {
            console.error('Search failed:', error);
          });
        }
      }, 100);
    }
  }));

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
          const results = await searchLocations(query);
          setSuggestions(results);
        } catch (error: any) { // Explicitly type error as any or unknown
          console.error('Search failed:', error);
          setError(error.message || 'Failed to fetch locations.'); // Set error message
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setError(null); // Clear error if query is too short
      }
    }, 800);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    const selectedLocationName = formatLocationDisplay(location).name;
    onSearchQuery(selectedLocationName); // Add to recent searches
    onLocationAdd(location); // This will set current location and fetch weather data
    setQuery('');
    if (externalSetSearchQuery) {
      externalSetSearchQuery('');
    }
    setSuggestions([]);
  };

  const formatLocationDisplay = (location: LocationSuggestion): { name: string; details: string } => {
    const { components } = location;
    const city = components.city || components.town || components.village || components.hamlet;
    const state = components.state || components.state_code;
    const country = components.country;
    const postcode = components.postcode;

    let name = '';
    let details = '';

    if (city) name = city;
    if (state && state !== city) details += state;
    if (country && country !== state) {
      if (details) details += ', ';
      details += country;
    }
    if (postcode) {
      if (details) details += ' ';
      details += postcode;
    }

    return {
      name: name || location.formatted,
      details: details || ''
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSuggestions([]); // Clear suggestions on submit

    try {
      // Search for locations based on the query
      const searchResults = await searchLocations(query.trim());

      if (searchResults.length > 0) {
        const location = searchResults[0]; // Take the first result
        handleLocationSelect(location);
      } else {
        setError('No locations found for your query.');
        console.warn('No locations found for the search query');
      }
    } catch (error: any) {
      console.error('Search failed:', error);
      setError(error.message || 'An error occurred during search.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (location: LocationSuggestion) => {
    handleLocationSelect(location);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const newValue = e.target.value;
            setQuery(newValue);
            if (externalSetSearchQuery) {
              externalSetSearchQuery(newValue);
            }
            if (newValue.trim().length >= 3) {
              // Suggestions are handled by the useEffect hook
            } else {
              setSuggestions([]); // Clear suggestions if input is too short
              setError(null); // Clear error if input is too short
            }
          }}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </form>

      {/* Search Results */}
      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto transform transition-all duration-200 ease-in-out animate-in slide-in-from-top-2">
          <div className="p-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Results
            </h4>
            {suggestions.map((suggestion, index) => {
              const { name, details } = formatLocationDisplay(suggestion);
              // Changed "Delhi" to "New Delhi" here as per request
              const displayName = name === "Delhi" ? "New Delhi" : name;
              return (
                <div
                  key={index}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-150 transform hover:scale-[1.02]"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      {details && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Error message display */}
      {error && (
        <div className="absolute w-full mt-1 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  );
});

export default SearchBar;