// src/hooks/useForecast.js
import { useState, useEffect } from 'react';

const useForecast = (query, apiKey) => {
  
    const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      if (!query) return;

      try {
        let lat, lon;

        // 若是城市名稱，先轉成經緯度
        if (typeof query === "string") {
          const geoRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`
          );
          const geoData = await geoRes.json();
          lat = geoData.coord.lat;
          lon = geoData.coord.lon;
        } else {
          lat = query.lat;
          lon = query.lon;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (res.ok && data.daily) {
          setForecast(data.daily.slice(0, 7));
        } else {
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
