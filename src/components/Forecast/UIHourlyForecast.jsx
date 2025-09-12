import React from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";
import { useI18n } from "../i18n/I18nContext.jsx";

const HourlyForecastDisplay = ({ data, cityName, sunData, airQuality, tzOffsetSec = 0 }) => {
  const { t, translateWeather, currentLanguage } = useI18n();
  const toCityDate = (utcSeconds) => new Date((utcSeconds + tzOffsetSec) * 1000);
  const getCityHour = (utcSeconds) => toCityDate(utcSeconds).getUTCHours();


  const formatHour = (hour) => {
    if (currentLanguage === 'zh') {
      // 中文時間格式：上午/下午
      const period = hour >= 12 ? '下午' : '上午';
      const hour12 = hour % 12 || 12;
      return `${period}${hour12}點`;
    } else {
      // 英文時間格式：AM/PM
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}${ampm}`;
    }
  };

  // 生成天氣警告訊息
  const generateWeatherAlert = (airQuality) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    const nowUtcSeconds = Math.floor(Date.now() / 1000);
    const nowHour = getCityHour(nowUtcSeconds);
    
    const alerts = [];
  
    // 降雨
    const rainHours = data.filter(hour => hour.pop > 0.3);
    if (rainHours.length > 0) {

      const start = getCityHour(rainHours[0].dt);
      const end   = getCityHour(rainHours[rainHours.length - 1].dt);
      
      if (nowHour > end) {
        // 過期不顯示
      } else if (nowHour >= start && nowHour <= end) {
        alerts.push(t('alert.rain.continue', { time: formatHour(end) }));
      } else if (start === end) {
        alerts.push(t('alert.rain.single', { time: formatHour(start) }));
      } else {
        alerts.push(t('alert.rain.range', { start: formatHour(start), end: formatHour(end) }));
      }
    }
  
    // 💨 強風
    const highWind = data.find(hour => hour.wind_speed > 3);
    if (highWind) {
      const windSpeed = Math.round(highWind.wind_speed * 3.6);
      alerts.push(t('alert.wind', { speed: windSpeed }));
    }
  
    // 🔥 高溫 > 35°C
    const hot = data.find(hour => hour.temp > 35);
    if (hot) alerts.push(t('alert.hot'));
  
    // ❄️ 低溫 < 5°C
    const cold = data.find(hour => hour.temp < 5);
    if (cold) alerts.push(t('alert.cold'));
  
    // ☀️ 高紫外線
    const uv = data.find(hour => hour.uvi && hour.uvi > 7);
    if (uv) alerts.push(t('alert.uv'));
  
    // ⛈️ 雷暴
    const thunder = data.find(hour => hour.weather[0].description.toLowerCase().includes("thunder"));
    if (thunder) alerts.push(t('alert.thunder'));
  
    // 🌫️ 濃霧
    const fog = data.find(hour => hour.weather[0].description.toLowerCase().includes("fog"));
    if (fog) alerts.push(t('alert.fog'));
  
    // 🌫️ 沙塵或霾
    const dust = data.find(hour =>
      hour.weather[0].description.toLowerCase().includes("haze") ||
      hour.weather[0].description.toLowerCase().includes("dust")
    );
    if (dust) alerts.push(t('alert.dust'));
  
    // 😷 空氣品質（傳入 AQI）
    if (airQuality && airQuality.aqi) {
      const aqiKeys = {
        1: "aqi.good",
        2: "aqi.fair", 
        3: "aqi.moderate",
        4: "aqi.poor",
        5: "aqi.veryPoor"
      };
      const aqiKey = aqiKeys[airQuality.aqi];
      if (aqiKey) alerts.push(t(aqiKey));
    }
  
    return alerts.length > 0 ? alerts.join(" ") : null;
  };
  
  const weatherAlert = generateWeatherAlert(airQuality);

  // Icon雲朵顏色

  return (
    <section style={{
      borderRadius: '20px',
      padding: '16px',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 16px rgba(0,0,0,.1)', 
      position: 'relative'
    }}>
      {/* 天氣警告訊息 */}
      {Array.isArray(data) && data.length > 0 && weatherAlert && (
        <div style={{
          fontSize: '14px',
          marginBottom: '16px',
          padding: '6px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#e0e0e0',
          textAlign: 'center',
        }}>
          {weatherAlert}
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
            const hourStr = getCityHour(hour.dt); // ★ 用城市小時
            const isNow = index === 0;
            
            // 格式化時間顯示
            let timeDisplay;
            if (isNow) {
              timeDisplay = t('hourly.now');
            } else {
              timeDisplay = formatHour(hourStr);
            }
            
            // 檢查是否為日出或日落時間（基於實際API數據）
            const checkSpecialTime = (timestamp, sunData) => {
              if (!sunData) return { isSpecial: false, type: null };
              
              const currentTime = toCityDate(timestamp);
              const currentHour = currentTime.getUTCHours();
              const currentMinute = currentTime.getUTCMinutes();

              
              if (sunData.sunrise) {
                const sunriseTime = toCityDate(sunData.sunrise);
                const sunriseHour = sunriseTime.getUTCHours();
                const sunriseMinute = sunriseTime.getUTCMinutes();
                
                // 檢查是否在日出時間前後30分鐘內
                if (Math.abs((currentHour * 60 + currentMinute) - (sunriseHour * 60 + sunriseMinute)) <= 30) {
                  return { isSpecial: true, type: 'sunrise' };
                }
              }
              
              if (sunData.sunset) {

                const sunsetTime = toCityDate(sunData.sunset);
                const sunsetHour = sunsetTime.getUTCHours();
                const sunsetMinute = sunsetTime.getUTCMinutes();
                
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
            const pop = hour.pop > 0.3 ? `${Math.round(hour.pop * 100)}%` : null;

            
            return (
              <div
                key={index}
                className="forecast-hour-card"
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
              >
                {/* 時間 */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: isNow ? '700' : '500',
                  color: isNow ? '#ffffff' : '#b0b0b0',
                  letterSpacing: '0.5px',
                  background: 'transparent'
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
                  <WeatherIcon type={weatherType} size="sm" 
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
                      {t(`hourly.${specialType}`)}
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
                    width: '105%',
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

      <style jsx>{`
        .forecast-hour-card:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default HourlyForecastDisplay;