import React from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";


const HourlyForecastDisplay = ({ data, cityName, sunData }) => {

  console.log('Hourly forecast data length:', data?.length);
  console.log('Hourly forecast data:', data);
  console.log('Sun data:', sunData);

  if (!data || data.length === 0) return <p>Loading hourly forecast...</p>;

  // 生成天氣警告訊息
  const generateWeatherAlert = () => {
    const rainHour = data.find(hour => hour.pop > 0.3);
    const highWind = data.find(hour => hour.wind_speed > 8);
    
    if (rainHour && highWind) {
      const rainTime = new Date(rainHour.dt * 1000).getHours();
      const windSpeed = Math.round(highWind.wind_speed * 3.6);
      return `Rainy conditions expected around ${rainTime}PM. Wind gusts are up to ${windSpeed} km/h.`;
    } else if (rainHour) {
      const rainTime = new Date(rainHour.dt * 1000).getHours();
      return `Rainy conditions expected around ${rainTime}PM.`;
    } else if (highWind) {
      const windSpeed = Math.round(highWind.wind_speed * 3.6);
      return `Wind gusts are up to ${windSpeed} km/h.`;
    }
    return null;
  };

  const weatherAlert = generateWeatherAlert();

  return (
    <section style={{
      borderRadius: '20px',
      padding: '16px',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100vw',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      bottom: '0',
      position: 'absolute',
      // backgroundColor: '#1a1a1a',
      // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      // border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      {/* 天氣警告訊息 */}
      {weatherAlert && (
        <div style={{
          fontSize: '14px',
          marginBottom: '16px',
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#e0e0e0'
        }}>
          ⚠️ {weatherAlert}
        </div>
      )}

      {/* 小時預報滑動容器 */}
      <div style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '8px',
      }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          Width: 'max-content',
          paddingRight: '8px'
        }}>
          {data.slice(0, 24).map((hour, index) => {
            const date = new Date(hour.dt * 1000);
            const hourStr = date.getHours();
            const isNow = index === 0;
            
            // 格式化時間顯示
            let timeDisplay;
            if (isNow) {
              timeDisplay = "Now";
            } else if (hourStr === 0) {
              timeDisplay = "12AM";
            } else if (hourStr < 12) {
              timeDisplay = `${hourStr}AM`;
            } else if (hourStr === 12) {
              timeDisplay = "12PM";
            } else {
              timeDisplay = `${hourStr - 12}PM`;
            }
            
            // 檢查是否為日出或日落時間（基於實際API數據）
            const checkSpecialTime = (timestamp, sunData) => {
              if (!sunData) return { isSpecial: false, type: null };
              
              const currentTime = new Date(timestamp * 1000);
              const currentHour = currentTime.getHours();
              const currentMinute = currentTime.getMinutes();
              
              if (sunData.sunrise) {
                const sunriseTime = new Date(sunData.sunrise * 1000);
                const sunriseHour = sunriseTime.getHours();
                const sunriseMinute = sunriseTime.getMinutes();
                
                // 檢查是否在日出時間前後30分鐘內
                if (Math.abs((currentHour * 60 + currentMinute) - (sunriseHour * 60 + sunriseMinute)) <= 30) {
                  return { isSpecial: true, type: 'sunrise' };
                }
              }
              
              if (sunData.sunset) {
                const sunsetTime = new Date(sunData.sunset * 1000);
                const sunsetHour = sunsetTime.getHours();
                const sunsetMinute = sunsetTime.getMinutes();
                
                // 檢查是否在日落時間前後30分鐘內
                if (Math.abs((currentHour * 60 + currentMinute) - (sunsetHour * 60 + sunsetMinute)) <= 30) {
                  return { isSpecial: true, type: 'sunset' };
                }
              }
              
              return { isSpecial: false, type: null };
            };

            const iconCodeToType = (iconCode) => {
              if (!iconCode) return 'Clear';
            
              const map = {
                '01': 'Clear',
                '02': 'Sun-shower',
                '03': 'Clouds',
                '04': 'Clouds',
                '09': 'Rain',
                '10': 'Rain',
                '11': 'Thunderstorm',
                '13': 'Snow',
                '50': 'Clouds',
              };
            
              const key = iconCode.slice(0, 2);
              return map[key] || 'Clear';
            };
            const specialTimeInfo = checkSpecialTime(hour.dt, sunData);
            const isSpecialTime = specialTimeInfo.isSpecial;
            const specialType = specialTimeInfo.type;
            const icon = hour.weather[0].icon;
            const weatherType = iconCodeToType(icon);
            const temp = Math.round(hour.temp);
            const pop = hour.pop > 0.1 ? `${Math.round(hour.pop * 100)}%` : null;

            return (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  minWidth: '80px',
                  width: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',

                  gap: '8px',
                  margin: '4px 4px',
                  padding: '16px 8px',
                  borderRadius: '24px',
                  backgroundColor: isNow ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: isNow ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  if (!isNow) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isNow) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* 時間 */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: isNow ? '700' : '500',
                  color: isNow ? '#ffffff' : '#b0b0b0',
                  letterSpacing: '0.5px'
                }}>
                  {timeDisplay}
                </div>

                {/* 天氣圖標 */}
                <div style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px',
                  background: 'transparent'
                }}>
                  <WeatherIcon type={weatherType} size="xs" 
                    style={{ 
                      width: '36px', 
                      height: '36px',
                      filter: 'brightness(1.2) contrast(1.1)',
                      opacity: isNow ? 1 : 0.9,
                      background:'transparent',
                  }} />
                  {/* 特殊時間圖標 */}
                  {isSpecialTime && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      right: '-6px',
                      fontSize: '14px',
                      background: 'transparent',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {specialType === 'sunset' ? '🌅' : '🌇'}
                    </div>
                  )}
                </div>

                {/* 溫度 */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isNow ? '#ffffff' : '#e0e0e0',
                  marginTop: '2px',
                  background: 'transparent'
                }}>
                  {isSpecialTime ? (
                    <span style={{ 
                      fontSize: '12px', 
                      color: specialType === 'sunrise' ? '#ffa500' : '#ff6b6b',
                      background: 'transparent'
                    }}>
                      {specialType === 'sunrise' ? 'Sunrise' : 'Sunset'}
                    </span>
                  ) : (
                    `${temp}°`
                  )}
                </div>

                {/* 降雨機率 */}
                {pop && (
                  <div style={{
                    fontSize: '11px',
                    color: '#4a9eff',
                    fontWeight: '600',
                    background: 'transparent',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    border: '1px solid rgba(74, 158, 255, 0.3)'
                  }}>
                    💧{pop}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 自定義滾動條樣式 */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 4px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default HourlyForecastDisplay;