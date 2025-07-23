// src/hooks/useForecast.js
import { useState, useEffect } from 'react';

const useForecast = (query, apiKey) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      if (!query) return;

      try {
        let url = "";
        
        // 根據 query 類型構建 URL - 使用 5-day forecast API
        if (typeof query === "string") {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`;
        } else {
          // 如果是座標對象
          const { lat, lon } = query;
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        }

        const res = await fetch(url);
        const data = await res.json();
        console.log("5-day Forecast API 回傳：", data);

        if (res.ok && data.list) {
          // 處理 5-day forecast 數據，每天取中午12點左右的數據
          const dailyForecasts = [];
          const processedDates = new Set();

          data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toDateString();
            const hour = date.getHours();
            
            // 只取每天第一筆資料，避免重複
            if (!processedDates.has(dateString)) {
              dailyForecasts.push({
                dt: item.dt,
                temp: {
                  day: item.main.temp // 使用當前溫度作為日間溫度
                },
                weather: item.weather
              });
              processedDates.add(dateString);
            }
          });

          setForecast(dailyForecasts.slice(0, 5)); // 取前5天
        } else {
          console.error("預報 API 錯誤：", data);
          setForecast([]);
        }
      } catch (error) {
        console.error("預報 API 錯誤：", error);
        setForecast([]);
      }
    };

    fetchForecast();
  }, [query, apiKey]);

  return forecast;
};

export default useForecast;