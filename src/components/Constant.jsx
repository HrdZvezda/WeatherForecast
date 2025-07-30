export const APP_CONFIG = {
    API_KEY: import.meta.env.VITE_WEATHER_API_KEY,
    AUTO_REFRESH_INTERVAL: 180000, // 3分鐘
    DEFAULT_CITY: 'banqiao',
    SHAKE_DURATION: 300,
    
    // API URLs
    WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    
    // LocalStorage Keys
    STORAGE_KEYS: {
      FAVORITES: 'favorites',
      LAST_CITY: 'lastCity',
      USER_PREFERENCES: 'userPreferences'
    },
    
    // Error Messages
    ERROR_MESSAGES: {
      CITY_NOT_FOUND: '❗ 查無此地區，請重新輸入',
      API_ERROR: '❗ 無法獲取天氣資料，請稍後再試',
      LOCATION_ERROR: '❗ 無法獲取位置資訊'
    }
  }