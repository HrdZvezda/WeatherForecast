import { useState, useCallback } from 'react'
import { WeatherAPI } from './WeatherAPI'
import { APP_CONFIG } from './Constant'

export function useWeatherData() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  
  const fetchWeather = useCallback(async (query) => {
    setLoading(true)
    setError('')
    
    try {
      let result
      if (typeof query === 'string') {
        result = await WeatherAPI.fetchWeatherByCity(query)
      } else {
        result = await WeatherAPI.fetchWeatherByCoords(query.lat, query.lon)
      }
      
      if (result.success) {
        setWeather(result.data)
        setLastUpdate(new Date())
        console.log('天氣資料已更新:', new Date().toLocaleTimeString())
      } else {
        setError(APP_CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND)
        setWeather(null)
      }
    } catch (err) {
      console.error('API 錯誤：', err)
      setError(APP_CONFIG.ERROR_MESSAGES.API_ERROR)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const clearError = () => setError('')
  
  return {
    weather,
    loading,
    error,
    lastUpdate,
    fetchWeather,
    clearError
  }
}