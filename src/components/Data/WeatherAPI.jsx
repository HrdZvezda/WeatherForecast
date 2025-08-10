import React from "react"

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export class WeatherAPI {
  static async fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    return this.makeRequest(url)
  }
  
  static async fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    return this.makeRequest(url)
  }
  
  static async fetchAirQualityByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return this.makeRequest(url);
  }

  static async fetchForecastByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    return this.makeRequest(url);
  }

  static async makeRequest(url) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || '無法獲取天氣資料')
      }
      
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}