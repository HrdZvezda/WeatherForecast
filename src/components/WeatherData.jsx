import { useState, useCallback } from 'react'
import { WeatherAPI } from './WeatherAPI'
import { APP_CONFIG } from './Constant'

export function useWeatherData() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  
  const fetchWeather = useCallback(async (query) => {
    if (!query) {
      console.warn('fetchWeather: query 為空');
      return;
    }

    setLoading(true)
    setError('')
    console.log('開始獲取天氣資料，query:', query, 'type:', typeof query)
    
    try {
      let result
      
      // 檢查 query 是否為坐標對象
      if (typeof query === 'object' && query !== null && 'lat' in query && 'lon' in query) {
        console.log('使用坐標獲取天氣:', query.lat, query.lon)
        result = await WeatherAPI.fetchWeatherByCoords(query.lat, query.lon)
      } else if (typeof query === 'string') {
        console.log('使用城市名稱獲取天氣:', query)
        result = await WeatherAPI.fetchWeatherByCity(query)
      } else {
        throw new Error('無效的查詢格式')
      }
      
      console.log('API 回應:', result)
      
      if (result.success) {
        setWeather(result.data)
        setLastUpdate(new Date())
        console.log('天氣資料已更新:', result.data.name, new Date().toLocaleTimeString())
      } else {
        console.error('API 回應錯誤:', result.error)
        setError(result.error || APP_CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND)
        setWeather(null)
      }
    } catch (err) {
      console.error('fetchWeather 錯誤：', err)
      setError(err.message || APP_CONFIG.ERROR_MESSAGES.API_ERROR)
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