import { useState, useEffect } from 'react'
import { LocalStorageManager } from './LocalStorage'
import { APP_CONFIG } from './Constant'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  
  // 載入收藏
  useEffect(() => {
    const saved = LocalStorageManager.get(APP_CONFIG.STORAGE_KEYS.FAVORITES, [])
    if (Array.isArray(saved)) {
      setFavorites(saved)
    }
    setHasLoaded(true)
  }, [])
  
  // 儲存收藏
  useEffect(() => {
    if (hasLoaded) {
      LocalStorageManager.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, favorites)
    }
  }, [favorites, hasLoaded])
  
  const addFavorite = (weather) => {
    if (!weather || favorites.some(f => f.name === weather.name)) return
    
    const newFavorite = {
      name: weather.name,
      temp: weather.main.temp,
      addedAt: new Date().toISOString()
    }
    setFavorites(prev => [...prev, newFavorite])
  }
  
  const removeFavorite = (cityName) => {
    setFavorites(prev => prev.filter(f => f.name !== cityName))
  }
  
  const isFavorite = (cityName) => {
    return favorites.some(f => f.name === cityName)
  }
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    hasLoaded
  }
}