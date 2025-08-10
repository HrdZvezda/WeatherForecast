import React, { useState, useEffect } from 'react'
import './App.css'
// Components
import HeaderWithTime from './components/Data/CurrentTime.jsx'
import Search from './components/Navbar/Search.jsx'
import Collection from './components/Navbar/Collection.jsx'
import NavgationBar from './components/Navbar/NAV.jsx'

import HourlyForecastDisplay from './components/Forecast/UIHourlyForecast.jsx'
import VerticalWeekdaySelector from './components/Forecast/ForecastSelect.jsx'


// Custom Hooks
import useGetlocation from './components/Data/GetLocation.jsx'
import { 
  useWeatherData,
  useCurrentTemp,
  useForecast,
  useHourlyForecast 
} from './components/Data/WeatherData.jsx'
import { useFavorites } from './components/Navbar/Collection.jsx'
import { useAutoRefresh } from './components/Data/AutoRefresh.jsx'

// Utils & Config
import { APP_CONFIG } from './components/Data/Constant.jsx'
import { formatTemperature } from './components/Data/Helpers.jsx'
import WeatherIcon from './components/Bg-Icon/WeatherIcon.jsx'
import { WeatherAPI } from './components/Data/WeatherAPI.jsx'
import WeatherCardSelector from './components/WeatherCard/CardSelect.jsx'

function App() {
  // ===== State Management =====
  const [city, setCity] = useState('')
  const [query, setQuery] = useState(APP_CONFIG.DEFAULT_CITY)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showCollection, setShowCollection] = useState(false)
  const [airQuality, setAirQuality] = useState(null);

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
  } = useFavorites()

  const handleToggleCollection = () => {
    setShowCollection(prev => !prev)
  }
  // Location Hook
  const { 
    location, 
    error: locationError, 
    loading: locationLoading, 
    getLocation, 
    clearError: clearLocationError 
  } = useGetlocation()
  
  // Forecast Data
  const forecast = useForecast(query, APP_CONFIG.API_KEY)
  const hourlyForecast = useHourlyForecast(query, APP_CONFIG.API_KEY)
  const currentTemp = useCurrentTemp(query, APP_CONFIG.API_KEY)

  // ===== Auto Refresh =====
  useAutoRefresh(
    () => fetchWeather(query),
    [query],
    isAutoRefresh
  )

  // 一進入網頁就自動定位
  useEffect(() => {
    console.log("App 初始化，開始自動定位...")
    
    // 檢查是否有地理位置 API
    if ('geolocation' in navigator) {
      getLocation() // 自動獲取位置
    } else {
      console.warn("瀏覽器不支援地理位置，使用預設城市")
      setQuery(APP_CONFIG.DEFAULT_CITY)
    }
    
    setHasInitialized(true)
  }, [getLocation]) // 只在組件初始化時執行
  
  
  // ===== Event Handlers =====
  const handleGetLocation = () => {
    console.log("按下定位按鈕")
    clearLocationError()
    clearWeatherError()
    getLocation()
  }
  
  const handleAddFavorite = () => {
    if (weather) {
      addFavorite(weather)
    }
  }
  const handleRemoveFavorite = (cityName) => {
    removeFavorite(cityName)
  }

  // ===== Effects =====
  // Fetch weather data when query changes
  useEffect(() => {
    console.log("query 變化，準備獲取天氣:", query)
    if (query) {
      fetchWeather(query)
  
      // 👉 新增：抓空氣品質
      const getAQI = async () => {
        let lat, lon;
        if (typeof query === 'object') {
          lat = query.lat;
          lon = query.lon;
        } else if (weather?.coord) {
          lat = weather.coord.lat;
          lon = weather.coord.lon;
        }
  
        if (lat && lon) {
          const { success, data } = await WeatherAPI.fetchAirQualityByCoords(lat, lon);
          if (success) {
            setAirQuality({ aqi: data.list[0].main.aqi });
          } else {
            setAirQuality(null);
          }
        }
      };
  
      getAQI();
    }
  }, [query, fetchWeather]);
  
  
  // Set query when location is obtained
  useEffect(() => {
    console.log("location 更新:", location)
    if (location && (location.lat && location.lon)) {
      console.log("設置 query 為坐標:", location)
      setQuery(location)
    }
  }, [location])
  
  // 處理定位失敗，回退到預設城市
  useEffect(() => {
    if (locationError && hasInitialized && !query) {
      console.log("定位失敗，使用預設城市:", APP_CONFIG.DEFAULT_CITY)
      setQuery(APP_CONFIG.DEFAULT_CITY)
    }
  }, [locationError, hasInitialized, query])

  // 定位錯誤調試
  useEffect(() => {
    if (locationError) {
      console.error("定位錯誤:", locationError)
    }
  }, [locationError])

  // 天氣錯誤調試
  useEffect(() => {
    if (weatherError) {
      console.error("天氣錯誤:", weatherError)
    }
  }, [weatherError])
  
  // Debug logging
  useEffect(() => {
    console.log("query 更新：", query)
  }, [query])
  

  // ===== Render Helpers =====
  const renderCurrentWeather = () => {
    // 顯示初始化狀態
    if (!hasInitialized || (locationLoading && !query)) {
      return <p>🔍 正在獲取您的位置...</p>
    }
    
    if (weatherLoading) {
      return <p>Loading...</p>
    }
    
    if (weatherError) {
      return <p style={{color: 'red'}}>❌ 錯誤: {weatherError}</p>
    }
    
    if (weather) { 
      const weatherType = weather.weather[0].main
      
      return (
        <>
          <h1 className='cityName'>
            {weather.name}
            {/* 顯示是否為定位結果 */}
            {typeof query === 'object' && (
              <span style={{fontSize: '0.5em', color: '#666'}}></span>
            )}
          </h1>
          <h2 className='current-temp'>{formatTemperature(weather.main.temp)}</h2>
        </>
      )
    }
    
    return <p>⏳ 初始化中...</p>
  }
  
  
  // ===== Main Render =====
  return (
    <>
    <div className="app-wrapper">
      
      {/* Navigation */}
      <NavgationBar
        setQuery={setQuery} 
        weather={weather}
        favorites={favorites}
        isFavorite={isFavorite}
        handleAddFavorite={handleAddFavorite}
        handleRemoveFavorite={handleRemoveFavorite}
        handleGetLocation={handleGetLocation}
        locationLoading={locationLoading}
      >
        <Search 
          city={city}
          setCity={setCity}
          setQuery={setQuery}
          error={weatherError}
          />
      </NavgationBar>

      <main className='main'>  
        {/* Weather Content */}
        <section className='weather'>
          <div className="weather-content">

            <section className="current-weather">
              <VerticalWeekdaySelector
               forecastData={forecast}  
               currentTemp={currentTemp} 
              />

              <WeatherCardSelector
                forecastData={forecast} // 確保這個有資料
                weather={weather} // 當前天氣資料
                query={query} // 你的查詢參數
                API_KEY={APP_CONFIG.API_KEY} // 你的 API key
                initialDay={0}
              />
              {renderCurrentWeather()}
            </section>

            <div className='weather-container'>              
              <section className="hourly-section">
                <HourlyForecastDisplay 
                data={hourlyForecast} 
                cityName={weather?.name} 
                sunData={{
                  sunrise: weather?.sys?.sunrise,
                  sunset: weather?.sys?.sunset
                }}
                airQuality={airQuality}
                />
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
          <div>最後更新: {lastUpdate?.toLocaleTimeString() || '未更新'}</div>
          <div>自動更新: {isAutoRefresh ? '開啟' : '關閉'}</div>
          <div>收藏數量: {favorites.length}</div>
          <div>定位狀態: {locationLoading ? '定位中' : location ? '已定位' : '未定位'}</div>
          <div>天氣載入: {weatherLoading ? '載入中' : '完成'}</div>
          <div>錯誤: {locationError || weatherError || '無'}</div>
        </div>
      )}
    </div>
  </>
  )
}

export default App