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
  }, [query, apiKey]);
        

  return hourlyData;
};

export default useHourlyForecast;