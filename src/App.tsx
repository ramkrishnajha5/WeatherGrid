import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LocationSuggestion } from './types/weather';
import { getCurrentWeather } from './services/weatherApi';
import { Navigation } from 'lucide-react';
import SearchBar from './components/SearchBar';




// --- Component Definitions ---








function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationSuggestion | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null); // State for location permission errors
  const [savedLocations, setSavedLocations] = useLocalStorage<LocationSuggestion[]>('savedLocations', []);
  const [homeCity, setHomeCity] = useLocalStorage<LocationSuggestion | null>('homeCity', null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const searchBarRef = useRef<{ setSearchQuery: (query: string) => void }>(null);

  // Check if user should see welcome dashboard
  useEffect(() => {
    // Show welcome if no saved locations and no home city
    if (savedLocations.length === 0 && !homeCity) {
      setIsFirstTimeUser(true);
    } else {
      setIsFirstTimeUser(false);
    }
  }, [savedLocations, homeCity]);

  // --- Handle Current Location Button Click ---
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationSuggestion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            formatted: 'Current Location', // This will be updated with actual city name later
            components: {
              city: 'Current Location',
              country: ''
            }
          };
          // Attempt to get city name from coordinates (mocked here)
          // In a real app, you'd use a reverse geocoding API
          const fetchCityName = async () => {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
            return "Your Current City";
          };
          fetchCityName().then(cityName => {
            location.components.city = cityName;
            location.formatted = `${cityName}, Lat: ${location.lat.toFixed(2)}, Lon: ${location.lng.toFixed(2)}`;
            setCurrentLocation(location);
            setLocationError(null); // Clear any previous errors
            // Exit welcome screen so dashboard renders with current location
            setIsFirstTimeUser(false);
          });
        },
        (error) => {
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
              break;
          }
          setLocationError(errorMessage);
          setCurrentLocation(null); // Ensure no location is set if there's an error
          // Exit welcome screen to surface the error UI with retry option
          setIsFirstTimeUser(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setCurrentLocation(null);
    }
  };

  useEffect(() => {
    // Prioritize home city if it exists
    if (homeCity && currentLocation === null) {
      setCurrentLocation(homeCity);
      return;
    }

    // If there are saved locations but no home city is set, show New Delhi
    // This only applies on app initialization (refresh/reopen), not when user actively searches
    // Only set if currentLocation is null (app initialization)
    if (savedLocations.length > 0 && !homeCity && currentLocation === null) {
      const newDelhiLocation: LocationSuggestion = {
        lat: 28.6139,
        lng: 77.2090,
        formatted: 'New Delhi, India',
        components: { city: 'New Delhi', country: 'India' }
      };
      setCurrentLocation(newDelhiLocation);
      return;
    }

    // Attempt to get user's current location on app load IF no home city is set
    // and if the user hasn't explicitly denied permission previously (though this requires more complex state management)
    // For simplicity, we'll just try to get it. The handleUseCurrentLocation handles the explicit button click.
    // If you want it to auto-load current location on first visit, uncomment the following block.
    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationSuggestion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            formatted: 'Current Location',
            components: {
              city: 'Current Location',
              country: ''
            }
          };
          // Mocking city name fetch for initial load
          const fetchCityName = async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return "Initial City";
          };
          fetchCityName().then(cityName => {
            location.components.city = cityName;
            location.formatted = `${cityName}, Lat: ${location.lat.toFixed(2)}, Lon: ${location.lng.toFixed(2)}`;
            setCurrentLocation(location);
          });
        },
        (error) => {
          // On initial load, if denied, we don't set an error, just don't load current location.
          // User can click 'Use Current Location' later.
          console.warn(`Geolocation on load failed: ${error.message}.`);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
    */
  }, [homeCity, savedLocations, currentLocation]); // Only override with homeCity when no currentLocation is set

  const handleLocationAdd = async (location: LocationSuggestion) => {
    // Set current location immediately
    setCurrentLocation(location);
    setIsSidebarOpen(false);

    // Fetch weather data to get the actual city name
    try {
      const weatherResponse = await getCurrentWeather(location.lat, location.lng);
      if (weatherResponse.data && weatherResponse.data.length > 0) {
        const weatherData = weatherResponse.data[0];

        // Update location with actual city name from weather API
        const updatedLocation = {
          ...location,
          components: {
            ...location.components,
            city: weatherData.city_name
          }
        };

        // Check if location already exists
        const exists = savedLocations.some(
          (saved) => saved.lat === location.lat && saved.lng === location.lng
        );

        if (!exists) {
          let newSavedLocations = [...savedLocations, updatedLocation];

          // Limit to 5 locations using FIFO
          if (newSavedLocations.length > 5) {
            newSavedLocations = newSavedLocations.slice(-5);
          }

          setSavedLocations(newSavedLocations);
        }
      }
    } catch (error) {
      console.error('Error fetching weather data for location:', error);
      // Still save the location even if weather fetch fails
      const exists = savedLocations.some(
        (saved) => saved.lat === location.lat && saved.lng === location.lng
      );

      if (!exists) {
        let newSavedLocations = [...savedLocations, location];
        if (newSavedLocations.length > 5) {
          newSavedLocations = newSavedLocations.slice(-5);
        }
        setSavedLocations(newSavedLocations);
      }
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setCurrentLocation(location);
    setIsSidebarOpen(false);
  };

  const handleLocationRemove = (locationToRemove: LocationSuggestion) => {
    setSavedLocations(savedLocations.filter(
      (location) => !(location.lat === locationToRemove.lat && location.lng === locationToRemove.lng)
    ));

    // If removing the home city, clear it
    if (homeCity && homeCity.lat === locationToRemove.lat && homeCity.lng === locationToRemove.lng) {
      setHomeCity(null);
    }

    // If removing the current location, switch to home or first saved location
    if (currentLocation && currentLocation.lat === locationToRemove.lat && currentLocation.lng === locationToRemove.lng) {
      if (homeCity && !(homeCity.lat === locationToRemove.lat && homeCity.lng === locationToRemove.lng)) {
        setCurrentLocation(homeCity);
      } else {
        const remainingLocations = savedLocations.filter(
          (location) => !(location.lat === locationToRemove.lat && location.lng === locationToRemove.lng)
        );
        if (remainingLocations.length > 0) {
          setCurrentLocation(remainingLocations[0]);
        } else {
          setCurrentLocation(null); // No more locations to show
        }
      }
    }
  };

  const handleSetHome = (location: LocationSuggestion) => {
    setHomeCity(location);
  };

  const handleSearchQuery = (query: string) => {
    // Add to recent searches when user makes a selection
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newSearches = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
    }
  };
  
  // Function to handle clicks on recent search items
  const handleRecentSearchClick = (searchTerm: string) => {
    // Set the search term in the search bar
    if (searchBarRef.current) {
      searchBarRef.current.setSearchQuery(searchTerm);
    }
    // Trigger the search manually by updating recent searches to ensure the weather is fetched
    // (Assuming SearchBar component handles fetching when query changes or a button is pressed)
    // We also add it to recent searches again to maintain its order if it was clicked.
    handleSearchQuery(searchTerm);
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex h-screen">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            onLocationAdd={handleLocationAdd}
            onLocationRemove={handleLocationRemove}
            onSetHome={handleSetHome}
            homeCity={homeCity}
            recentSearches={recentSearches}
            onSearchQuery={handleSearchQuery}
            onRecentSearchClick={handleRecentSearchClick} // Added handler for recent search clicks
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleSidebar={toggleSidebar}
            />

            <main className="flex-1 overflow-auto">
              <div className="min-h-full flex flex-col">
                <div className="flex-1">
                  {isFirstTimeUser ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="max-w-md w-full mx-auto p-8">
                        <div className="text-center mb-8">
                          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Welcome to WeatherGrid
                          </h1>
                          <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Get started by searching for your city to see current weather conditions and forecasts.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                          <SearchBar 
                            ref={searchBarRef}
                            onLocationAdd={(location) => {
                              handleLocationAdd(location);
                              setIsFirstTimeUser(false); // Hide welcome after selection
                            }} 
                            onSearchQuery={handleSearchQuery}
                            showActionButtons={true}
                          />
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                handleUseCurrentLocation();
                              }}
                              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                            >
                              <Navigation className="w-4 h-4" />
                              <span>Use Current Location</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : locationError ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <p className="text-red-500 text-lg">{locationError}</p>
                        <button onClick={handleUseCurrentLocation} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : currentLocation ? (
                    <MainDashboard location={currentLocation} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading location...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <Footer />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;