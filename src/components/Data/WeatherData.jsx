import { useState, useCallback, useEffect} from 'react'
import { WeatherAPI } from './WeatherAPI'
import { APP_CONFIG } from './Constant'
import { useI18n } from '../i18n/I18nContext'

export const useWeatherData = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  const { getApiLanguage } = useI18n()
  
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
      const lang = getApiLanguage() // 取得當前語言

      // 檢查 query 是否為坐標對象
      if (typeof query === 'object' && query !== null && 'lat' in query && 'lon' in query) {
        console.log('使用坐標獲取天氣:', query.lat, query.lon, lang)
        result = await WeatherAPI.fetchWeatherByCoords(query.lat, query.lon, lang)
      } else if (typeof query === 'string') {
        console.log('使用城市名稱獲取天氣:', query)
        result = await WeatherAPI.fetchWeatherByCity(query, lang)
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
  }, [getApiLanguage])
  
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

//Current Temperature Hook
export const useCurrentTemp = (city, apiKey) => {
  const [temp, setTemp] = useState(null);
  const { getApiLanguage } = useI18n();

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const lang = getApiLanguage();
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (res.ok) setTemp(data.main.temp);
      } catch (err) {
        console.error("取得即時溫度失敗", err);
      }
    };

    fetchTemp();
  }, [city, apiKey, getApiLanguage]);

  return temp;
};

// Forecast Hook
export const useForecast = (query, apiKey) => {
  const [forecast, setForecast] = useState(null);
  const { getApiLanguage } = useI18n();

  useEffect(() => {
    const fetchForecast = async () => {
      if (!query) return;

      try {
        const lang = getApiLanguage();
        let url = "";
        
        // 根據 query 類型構建 URL - 使用 5-day forecast API
        if (typeof query === "string") {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric&lang=${lang}`;
        } else {
          // 如果是座標對象
          const { lat, lon } = query;
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        console.log("5-day Forecast API 回傳：", data);

        if (res.ok && Array.isArray(data.list)) {
          setForecast(data);
        } else {
          console.error("預報 API 錯誤：", data);
          setForecast(null);
        }
      } catch (error) {
        console.error("預報 API 錯誤：", error);
        setForecast(null);
      }
    };

    fetchForecast();
  }, [query, apiKey, getApiLanguage]);

  return forecast;
};

// Hourly Forecast Hook
export const useHourlyForecast = (query, apiKey) => {
  const [hourlyData, setHourlyData] = useState([]);
  const { getApiLanguage } = useI18n();

  useEffect(() => {
    const fetchHourly = async () => {
      if (!query) return;
      try {
        let lat, lon;
        const lang = getApiLanguage();

        if (typeof query === 'string') {
          const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`);
          const geoData = await geoRes.json();
          if (!geoData.coord) throw new Error('查無座標');
          lat = geoData.coord.lat;
          lon = geoData.coord.lon;
        } else {
          lat = query.lat;
          lon = query.lon;
        }

        // 使用 5 Day Weather Forecast API（免費版本）
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`);
        const data = await res.json();

        if (res.ok && data.list) {
          const now = new Date();
          
          // 生成真正的每小時數據（插值計算）
          const generateHourlyData = () => {
            const hourlyArray = [];
            const forecastData = data.list.slice(0, 16); // 取前 8 個數據點（24小時）
            
            for (let i = 0; i < 24; i++) { // 只顯示接下來12小時
              const targetTime = new Date(now);
              
              if (i === 0) {
                // 第一個顯示當前時間
                targetTime.setMinutes(0, 0, 0);
              } else {
                // 後續顯示從下一個整點開始
                targetTime.setHours(now.getHours() + i, 0, 0, 0);
              }
              
              // 找到最接近的預報數據
              let closestData = forecastData[0];
              let minTimeDiff = Math.abs(new Date(forecastData[0].dt * 1000) - targetTime);
              
              forecastData.forEach(item => {
                const itemTime = new Date(item.dt * 1000);
                const timeDiff = Math.abs(itemTime - targetTime);
                if (timeDiff < minTimeDiff) {
                  minTimeDiff = timeDiff;
                  closestData = item;
                }
              });
              
              // 如果需要插值（當數據點間隔太大時）
              let interpolatedTemp = closestData.main.temp;
              let interpolatedPop = closestData.pop || 0;
              
              // 簡單的溫度插值（基於時間的線性插值）
              if (minTimeDiff > 3 * 60 * 60 * 1000) { // 如果超過3小時差距
                const nextData = forecastData.find(item => 
                  new Date(item.dt * 1000) > targetTime
                );
                const prevData = forecastData.find(item => 
                  new Date(item.dt * 1000) < targetTime
                );
                
                if (nextData && prevData) {
                  const nextTime = new Date(nextData.dt * 1000);
                  const prevTime = new Date(prevData.dt * 1000);
                  const ratio = (targetTime - prevTime) / (nextTime - prevTime);
                  
                  interpolatedTemp = prevData.main.temp + 
                    (nextData.main.temp - prevData.main.temp) * ratio;
                  interpolatedPop = (prevData.pop || 0) + 
                    ((nextData.pop || 0) - (prevData.pop || 0)) * ratio;
                }
              }
              
              hourlyArray.push({
                dt: Math.floor(targetTime.getTime() / 1000),
                temp: interpolatedTemp,
                weather: closestData.weather,
                pop: interpolatedPop,
                wind_speed: closestData.wind?.speed || 0,
                isInterpolated: minTimeDiff > 3 * 60 * 60 * 1000 // 標記是否為插值數據
              });
            }
            
            return hourlyArray;
          };
          
          const hourlyData = generateHourlyData();
          setHourlyData(hourlyData);
          
        } else {
          console.error('API 錯誤:', data);
          setHourlyData([]);
        }
      } catch (err) {
        console.error('小時預報 API 錯誤：', err);
        setHourlyData([]);
      }
    };

    fetchHourly();
  }, [query, apiKey, getApiLanguage]);
        
  return hourlyData;
};
