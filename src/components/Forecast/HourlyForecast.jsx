import { useState, useEffect } from 'react';

const useHourlyForecast = (query, apiKey) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchHourly = async () => {
      if (!query) return;
      try {
        let lat, lon;

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
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();

        if (res.ok && data.list) {
          // 轉換數據格式以符合原有的組件結構
          const transformedData = data.list.slice(0, 12).map(item => ({
            dt: item.dt,
            temp: item.main.temp,
            weather: item.weather,
            pop: item.pop || 0, // 降雨機率
            wind_speed: item.wind?.speed || 0
          }));
          
          setHourlyData(transformedData);
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
  }, [query, apiKey]);

  return hourlyData;
};

export default useHourlyForecast;