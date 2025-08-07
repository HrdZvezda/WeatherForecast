import React, { useState, useRef, useMemo, useEffect } from 'react';

//WeatherCardHooks
//FeelsLike
const useFeelsLike = (weather) => {
  return useMemo(() => {
    return weather?.main?.feels_like !== undefined
      ? Math.round(weather.main.feels_like)
      : null;
  }, [weather]);
};
//RainChance
const useRainChance = (query, API_KEY, weather) => {
  const [rainChance, setRainChance] = useState(null);

  useEffect(() => {
    async function getRainChance() {
      try {
        let url = '';
        if (typeof query === "string") {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`;
        } else if (query && query.lat && query.lon) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=metric`;
        } else {
          setRainChance(null);
          return;
        }
        const res = await fetch(url);
        const data = await res.json();
        const pop = data?.list?.[0]?.pop;
        if (typeof pop === 'number') {
          setRainChance(Math.round(pop * 100));
        } else {
          setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
        }
      } catch {
        setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
      }
    }
    if (query && API_KEY) {
      getRainChance();
    }
  }, [query, API_KEY, weather]);
  
  return rainChance;
};
//UV
const useUVIndex = (weather) => {
  return useMemo(() => {
    const estimateUV = (weather) => {
      if (!weather) return null;
      let uv = 8;
      const hour = new Date().getHours();
      if (hour < 6 || hour > 18) return 0;
      const main = weather.weather?.[0]?.main?.toLowerCase() || '';
      if (main.includes('cloud')) uv *= 0.5;
      if (main.includes('rain') || main.includes('drizzle')) uv *= 0.2;
      if (main.includes('thunderstorm')) uv *= 0.1;
      return Math.round(uv * 10) / 10;
    };

    const getUVLevel = (uv) => {
      if (uv === null) return "無資料";
      if (uv <= 2) return "低";
      if (uv <= 5) return "中等";
      if (uv <= 7) return "高";
      if (uv <= 10) return "極高";
      return "危險";
    };

    const uv = estimateUV(weather);
    return uv !== null ? `${uv} (${getUVLevel(uv)})` : null;
  }, [weather]);
};
//Wind
const useWindSpeed = (weather) => {
  return useMemo(() => {
    return weather?.wind?.speed !== undefined
      ? (weather.wind.speed * 3.6).toFixed(1) // m/s to km/h
      : null;
  }, [weather]);
};
//AirQuality
const useAirQuality = (weather) => {
  return useMemo(() => {
    // 簡化的空氣品質估算，基於能見度和污染物
    const visibility = weather?.visibility || 10000;
    if (visibility >= 10000) return "良好";
    if (visibility >= 5000) return "中等";
    if (visibility >= 1000) return "不良";
    return "極差";
  }, [weather]);
};
//Visibility
const useVisibility = (weather) => {
  return useMemo(() => {
    const visibility = weather?.visibility;
    return visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : null;
  }, [weather]);
};
//Pressure
const usePressure = (weather) => {
  return useMemo(() => {
    return weather?.main?.pressure !== undefined
      ? `${weather.main.pressure} hPa`
      : null;
  }, [weather]);
};
//Humidity
const useHumidity = (weather) => {
  return useMemo(() => {
    return weather?.main?.humidity !== undefined
      ? `${weather.main.humidity}%`
      : null;
  }, [weather]);
};

const WeatherCardSelector = ({ 
    forecastData = [],
    weather = null, // 當前天氣資料
    query = null, // 查詢參數
    API_KEY = null, // API 金鑰
    initialDay = 0, 
    onDayChange = () => {},
    backgroundColor = 'transparent',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialDay);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  
  // 使用所有的 hooks
  const rainChance = useRainChance(query, API_KEY, weather);
  const airQuality = useAirQuality(weather);
  const uvIndex = useUVIndex(weather);
  const visibility = useVisibility(weather);
  const windSpeed = useWindSpeed(weather);
  const feelsLike = useFeelsLike(weather);
  const pressure = usePressure(weather);
  const humidity = useHumidity(weather);
  
  const handleDayClick = (index) => {
    if (!isDragging) {
      setSelectedIndex(index);
      onDayChange(forecastData[index], index);
    }
  };

  const weatherStatus = (timestamp, index) => {
    const date = new Date(timestamp * 1000);
    
    if (index === 0) {
      return "Rain Chance";
    } else {
      const status = ["Air Quality", "UV Index", "Visibility", "Wind", "Feels Like", "Pressure", "Humidity"];
      return status[(index - 1) % status.length] || status[date.getDay() % status.length];
    }
  };

  const getWeatherValue = (index) => {
    switch (index) {
      case 0: return rainChance ? `${rainChance}%` : "0%";
      case 1: return airQuality || "N/A";
      case 2: return uvIndex || "N/A";
      case 3: return visibility || "N/A";
      case 4: return windSpeed ? `${windSpeed} km/h` : "N/A";
      case 5: return feelsLike ? `${feelsLike}°C` : "N/A";
      case 6: return pressure || "N/A";
      case 7: return humidity || "N/A";
      default: return "N/A";
    }
  };

  const getWeatherUnit = (index) => {
    switch (index) {
      case 0: return "";
      case 1: return "";
      case 2: return "";
      case 3: return "";
      case 4: return "";
      case 5: return "";
      case 6: return "";
      case 7: return "";
      default: return "";
    }
  };
  
  const getVisibleDays = () => {
    const items = [];
  
    // 如果沒有 forecastData，創建8個默認項目
    if (!forecastData || forecastData.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      for (let i = -2; i <= 2; i++) {
        let index = selectedIndex + i;
        if (index < 0) index = 8 + index;
        if (index >= 8) index = index - 8;
        
        items.push({
          day: { dt: now },
          index: index,
          offset: i,
        });
      }
      return items;
    }

    // 原本的邏輯，但確保至少有8個項目
    const totalItems = Math.max(forecastData.length, 8);
  
    for (let i = -2; i <= 2; i++) {
      let index = selectedIndex + i;
  
      if (index < 0) {
        index = totalItems + index;
      } else if (index >= totalItems) {
        index = index - totalItems;
      }
  
      const data = forecastData[index] || { dt: Math.floor(Date.now() / 1000) };
  
      items.push({
        day: data,
        index: index,
        offset: i,
      });
    }
  
    return items;
  };
  
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translateY(0)',
        zIndex: 500
    }}>
      <div 
        style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            width: '200px',
            height: '390px',
            borderRadius: '0 350px 350px 0',
            position: 'relative',
            overflow: 'hidden',
        }}
      >
        <div 
          ref={containerRef}
          style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            paddingLeft: '60px', 
          }}
        >
          {getVisibleDays().map(({ day, index, offset }) => {
            const isCenter = offset === 0;
            const statusName = weatherStatus(day.dt, index);
            const weatherValue = getWeatherValue(index);

            return (
              <div 
                key={`${index}-${offset}`}
                style={{
                    color: isCenter ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    fontSize: isCenter ? '16px' : Math.max(8, 16 - Math.abs(offset) * 2) + 'px',
                    fontWeight: isCenter ? '800' : '700',
                    opacity: Math.max(0.9, 1 - Math.abs(offset) * 0.1),
                    transform: `translateY(${offset * 130}px)`,
                    // transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position:'absolute',
                    bottom: isCenter ? '200px' : '130px',
                    right: isCenter ? '90px' : '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: isCenter ? 'none' : `blur(${Math.abs(offset)*0.05}px)`,
                }}
                onClick={() => handleDayClick(index)}
              >
                  <div
                      style={{
                          borderRadius: '5px',
                          marginTop: '10px',
                          width: '120px',
                          height: '180px',
                          position: 'absolute',
                        //   boxShadow: isCenter ? '0 1px 6px rgba(0,0,0,0.8)' : 'none'
                        }}>
                            <div style={{
                                borderBottom: isCenter ? '1px solid #eee' : 'none',
                                paddingBottom: '6px',
                                paddingTop:'10px',
                                margin: '0 10px'
                            }}>
                                {statusName}
                            </div>
                      {isCenter && (
                        <>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            width: '100%',
                            color: '#fff',
                            textAlign: 'center',
                          }}>
                            {weatherValue}
                          </div>
                        </>
                      )}
                  </div>
                </div>

            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherCardSelector;