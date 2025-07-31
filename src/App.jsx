import { useState, useEffect } from 'react'
import './App.css'

// Components
import HeaderWithTime from './components/CurrentTime.jsx'
import Search from './components/Search.jsx'
import Collection from './components/collection/Collection.jsx'
import NavgationBar from './components/Nav.jsx'

// Forecast Components
import useForecast from './components/Forecast/Forecast.jsx'
import ForecastDisplay from './components/Forecast/UIForecast.jsx'
import useHourlyForecast from './components/Forecast/HourlyForecast.jsx'
import HourlyForecastDisplay from './components/Forecast/UIHourlyForecast.jsx'

// Weather Card Components
import useFeelsLike from './components/WeatherCard/FeelsLike.jsx'
import useRainChance from './components/WeatherCard/RainChance.jsx'
import useUVIndex from './components/WeatherCard/UvIndex.jsx'
import useWindSpeed from './components/WeatherCard/WindSpeed.jsx'

// Custom Hooks
import useGetlocation from './components/GetLocation.jsx'
import { useWeatherData } from './components/WeatherData.jsx'
import { useFavorites } from './components/Favorites.jsx'
import { useAutoRefresh } from './components/AutoRefresh.jsx'


// Utils & Config
import { APP_CONFIG } from './components/Constant.jsx'
import { formatTemperature } from './components/Helpers.jsx'

function App() {
  // ===== State Management =====
  const [city, setCity] = useState('')
  const [query, setQuery] = useState(APP_CONFIG.DEFAULT_CITY)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  
  // ===== Custom Hooks =====
  // Weather Data Management
  const { 
    weather, 
    loading: weatherLoading, 
    error: weatherError, 
    lastUpdate, 
    fetchWeather, 
    clearError: clearWeatherError 
  } = useWeatherData()
  
  // Favorites Management
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    hasLoaded: favoritesLoaded 
  } = useFavorites()
  
  // Location Hook
  const { 
    location, 
    error: locationError, 
    loading: locationLoading, 
    getLocation, 
    clearError: clearLocationError 
  } = useGetlocation()
  
  // Weather Card Data
  const feelsLike = useFeelsLike(weather)
  const windSpeed = useWindSpeed(weather)
  const rainChance = useRainChance(query, APP_CONFIG.API_KEY, weather)
  const uvIndex = useUVIndex(weather)
  
  // Forecast Data
  const forecast = useForecast(query, APP_CONFIG.API_KEY)
  const hourlyForecast = useHourlyForecast(query, APP_CONFIG.API_KEY)
  
  // ===== Auto Refresh =====
  useAutoRefresh(
    () => fetchWeather(query),
    [query],
    isAutoRefresh
  )
  
  // ===== Event Handlers =====
  const handleGetLocation = () => {
    clearLocationError()
    getLocation()
  }
  
  const handleAddFavorite = () => {
    if (weather) {
      addFavorite(weather)
    }
  }
  

  // ===== Effects =====
  // Fetch weather data when query changes
  useEffect(() => {
    fetchWeather(query)
  }, [query, fetchWeather])
  
  // Set query when location is obtained
  useEffect(() => {
    if (location) {
      setQuery(location)
    }
  }, [location])
  
  
  // Debug logging
  useEffect(() => {
    console.log("query 更新：", query)
  }, [query])
  

  // ===== Render Helpers =====
  const renderCurrentWeather = () => {
    if (weatherLoading) {
      return <p>Loading...</p>
    }
    
    if (weatherError) {
      return <p>{weatherError}</p>
    }
    
    if (weather) {
      return (
        <>
          <h1 className='cityName'>{weather.name}</h1>
          <h2 className='current-temp'>{formatTemperature(weather.main.temp)}</h2>
        </>
      )
    }
    
    return <p>Loading...</p>
  }
  
  const renderWeatherCard = (title, value) => (
    <div className="weather-card col-6">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  )
  
  // ===== Main Render =====
  return (
    <div className="app-wrapper">

      {/* Navigation */}

      <NavgationBar
        weather={weather}
        isFavorite={isFavorite}
        handleAddFavorite={handleAddFavorite}
      >
        <Search 
          city={city}
          setCity={setCity}
          setQuery={setQuery}
          error={weatherError}
        />
      </NavgationBar>
        <div className='btn'>
          <button 
            className="location-btn" 
            onClick={handleGetLocation}
            disabled={locationLoading}
          >
            {locationLoading ? "🔄 定位中..." : "📍 Current Location"}
          </button>
        
        </div>

      <main className='main row'>
        {/* Favorites Section */}
        <aside>
          <Collection 
            weather={weather}
            setQuery={setQuery}
            favorites={favorites}
            setFavorites={() => {}} // 由 hook 管理，不需要直接設置
            removeFavorite={removeFavorite}
          />
        </aside>
          
        <section className='weather col-18'>
          {/* Weather Content */}
          <div className="weather-content">
            
            {/* Current Weather Display */}
            <section className="current-weather col-18">
              {renderCurrentWeather()}
            </section>

            <div className='weather-container'>
              
              {/* 5 Day Forecast */}
              <section className="forecast-section col-6">
                <ForecastDisplay forecast={forecast} />
              </section>

              {/* Hourly Forecast & Weather Details */}
              <section className="hourly-section col-12">
                <HourlyForecastDisplay 
                  data={hourlyForecast} 
                  cityName={weather?.name} 
                />
                
                {/* Weather Details Grid */}
                <div className="weather-details col-12">
                  {renderWeatherCard(
                    "體感溫度", 
                    formatTemperature(feelsLike)
                  )}
                  
                  {renderWeatherCard(
                    "UV指數", 
                    uvIndex !== null ? uvIndex : "載入中..."
                  )}
                  
                  {renderWeatherCard(
                    "降雨機率", 
                    rainChance !== null ? `${rainChance}%` : "載入中..."
                  )}
                  
                  {renderWeatherCard(
                    "風速", 
                    windSpeed !== null ? `${windSpeed} km/h` : "無資料"
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      
      {/* Debug Info (開發時用) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <div>最後更新: {lastUpdate?.toLocaleTimeString()}</div>
          <div>自動更新: {isAutoRefresh ? '開啟' : '關閉'}</div>
          <div>收藏數量: {favorites.length}</div>
          <div>當前查詢: {query}</div>
        </div>
      )}
    </div>
  )
}

export default App