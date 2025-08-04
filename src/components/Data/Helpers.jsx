export const formatTemperature = (temp) => {
    return temp !== null ? `${Math.round(temp)}°` : "無資料"
  }
  
  export const formatPercentage = (value) => {
    return value !== null ? `${value}%` : "載入中..."
  }
  
  export const formatSpeed = (speed) => {
    return speed !== null ? `${speed} km/h` : "無資料"
  }
  
  export const formatTime = (date) => {
    return date ? date.toLocaleTimeString() : "未知時間"
  }
  
  export const isValidWeatherData = (weather) => {
    return weather && weather.main && weather.main.temp !== undefined
  }