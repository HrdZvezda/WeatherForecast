import React, { useState, useRef } from 'react';
import WeatherIcon from '../Bg-Icon/WeatherIcon';
import { useSpring, animated } from '@react-spring/web';


const VerticalWeekdaySelector = ({ 
    forecastData = [],
    currentTemp = null,
    initialDay = 0, 
    onDayChange = () => {},
    backgroundColor = 'transparent',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialDay);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  
  const handleDayClick = (index) => {
    if (!isDragging) {
      setSelectedIndex(index);
      onDayChange(forecastData[index], index);
    }
  };

  const formatDate = (timestamp, index) => {
    const date = new Date(timestamp * 1000);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weekday = index === 0 ? "Today" : weekdays[date.getDay()];
    const month = date.toLocaleString("en", { month: "short" }); 
    const day = date.getDate(); 
    
    return {
      weekday,
      dateStr: `${day} ${month}`
    };
  };

  const getTempRange = (dayData) => {
    let min, max;
    
    if (dayData.temp?.min !== undefined && dayData.temp?.max !== undefined) {
      min = dayData.temp.min;
      max = dayData.temp.max;
    } else if (dayData.temp?.day !== undefined) {
      const dayTemp = dayData.temp.day;
      const nightTemp = dayData.temp.night || dayTemp - 8;
      min = Math.min(dayTemp, nightTemp);
      max = Math.max(dayTemp, nightTemp);
    } else {
      min = 20;
      max = 25;
    }
    return {
      min: Math.round(min),
      max: Math.round(max)
    };
  };

  const calculateTempArc = () => {
    if (!forecastData || forecastData.length === 0) return null;

    // 計算所有天數的溫度範圍
    const allTemps = [];
    forecastData.forEach(day => {
      const tempRange = getTempRange(day);
      allTemps.push(tempRange.min, tempRange.max);
    });

    const globalMin = Math.min(...allTemps) - 2;
    const globalMax = Math.max(...allTemps) - 1;

    // 獲取當前選中日期的溫度
    const selectedDay = forecastData[selectedIndex];
    if (!selectedDay) return null;

    const dayTempRange = getTempRange(selectedDay);
    const minTemp = dayTempRange.min;
    const maxTemp = dayTempRange.max;
    
    // 【修改2】統一角度計算邏輯 - 確保所有溫度都使用相同的映射公式
    const calculateAngle = (temp) => {
      if (globalMax === globalMin) return 90;
      return ((temp - globalMin) / (globalMax - globalMin)) * 180;
    };

    const minAngle = calculateAngle(minTemp);
    const maxAngle = calculateAngle(maxTemp);

    // 【修改3】修正當前溫度角度計算 - 使用統一的 calculateAngle 函數
    const currentTempAngle = (selectedIndex === 0 && currentTemp != null) 
      ? calculateAngle(currentTemp)
      : null;

    return {
      minTemp,
      maxTemp,
      minAngle,
      maxAngle,
      currentTemp: selectedIndex === 0 ? currentTemp : null,
      currentTempAngle,
      globalMin,
      globalMax
    };
  };

  const iconCodeToType = (iconCode) => {
    if (!iconCode) return 'Clear';
    const map = {
      '01d': 'Clear', '01n': 'Clear',
      '02d': 'Clouds', '02n': 'Clouds',
      '03d': 'Clouds', '03n': 'Clouds',
      '04d': 'Clouds', '04n': 'Clouds',
      '09d': 'Rain',   '09n': 'Rain',
      '10d': 'Rain',   '10n': 'Rain',
      '11d': 'Thunderstorm', '11n': 'Thunderstorm',
      '13d': 'Snow',   '13n': 'Snow',
      '50d': 'Clouds', '50n': 'Clouds',
    };
    return map[iconCode] || 'Clear';
  };

  const getVisibleDays = () => {
    const items = [];
  
    if (!forecastData || forecastData.length < 5) {
      console.warn("⚠️ forecastData is missing or not enough:", forecastData);
      return items;
    }
  
    for (let i = -2; i <= 2; i++) {
      let index = selectedIndex + i;
  
      if (index < 0) {
        index = forecastData.length + index;
      } else if (index >= forecastData.length) {
        index = index - forecastData.length;
      }
  
      const data = forecastData[index];
      if (!data) continue;
  
      items.push({
        day: data,
        index: index,
        offset: i,
      });
    }
  
    return items;
  };
  
  const tempArcData = calculateTempArc();
  
  const arcAnimation = useSpring({
    minAngle: tempArcData?.minAngle ?? 0,
    maxAngle: tempArcData?.maxAngle ?? 0,
    currentTempAngle: tempArcData?.currentTempAngle ?? 0,
    minTemp: tempArcData?.minTemp ?? 0,
    maxTemp: tempArcData?.maxTemp ?? 0,
    currentTemp: tempArcData?.currentTemp ?? 0,
    config: { tension: 120, friction: 32 },
  });
  
  
  
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translateY(0)',
        zIndex: 500
    }}>
      <div style={{
          width: '250px',
          height: '390px',
          borderRadius: '350px 0 0 350px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          position: 'relative'
      }}>
        
        {/* 溫度弧形進度條 */}
        {tempArcData && (
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
            width: '100px',
            height: '390px',
            pointerEvents: 'none',
          }}>
            <svg
              width="160"
              height="300"
              viewBox="0 0 160 300"
              style={{ overflow: 'visible' }}
            >
              {/* 背景弧線 */}
              <path
                d="M 45 365 A 100 100 0 0 1 45 25"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="50"
                strokeLinecap="round"
              />
              
              {/* 溫度範圍弧線 */}
              <animated.path
                d="M 45 365 A 100 100 0 0 1 45 25"
                fill="none"
                stroke="url(#tempGradient)"
                strokeWidth="30"
                strokeLinecap="round"
                strokeDasharray={arcAnimation.maxAngle.to(max => {
                  const length = ((max - arcAnimation.minAngle.get()) / 180) * 439.8;
                  return `${length} 439.8`;
                })}
                strokeDashoffset={arcAnimation.minAngle.to(min => -min / 180 * 439.8)}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                }}
              />

             {/* {tempArcData.currentTempAngle !== null && (
                <g>
                  當前溫度點 - 使用修正後的座標計算
                  <animated.circle
                    cx={arcAnimation.currentTempAngle.to(angle => {
                      將角度轉換為弧度，注意 SVG 座標系統
                      const radian = (180 - angle) * Math.PI / 180;
                      return 45 + 100 * Math.cos(radian);
                    })}
                    cy={arcAnimation.currentTempAngle.to(angle => {
                      const radian = (180 - angle) * Math.PI / 180;
                      return 195 - 100 * Math.sin(radian);
                    })}
                    r="12"
                    fill="#FFD700"
                    stroke="#FFA500"
                    strokeWidth="3"
                    style={{
                      filter: 'drop-shadow(0 2px 6px rgba(255, 165, 0, 0.6))'
                    }}
                  />
                  
                  當前溫度的光暈效果
                  <animated.circle
                    cx={arcAnimation.currentTempAngle.to(angle => {
                      const radian = (180 - angle) * Math.PI / 180;
                      return 45 + 100 * Math.cos(radian);
                    })}
                    cy={arcAnimation.currentTempAngle.to(angle => {
                      const radian = (180 - angle) * Math.PI / 180;
                      return 195 - 100 * Math.sin(radian);
                    })}
                    r="18"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2"
                    opacity="0.5"
                    style={{
                      filter: 'blur(2px)'
                    }}
                  />
                  
                  <animated.text
                    x={arcAnimation.currentTempAngle.to(angle => {
                      const radian = (180 - angle) * Math.PI / 180;
                      return 45 + 130 * Math.cos(radian);
                    })}
                    y={arcAnimation.currentTempAngle.to(angle => {
                      const radian = (180 - angle) * Math.PI / 180;
                      return 200 - 130 * Math.sin(radian);
                    })}
                    fill="#FFD700"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                      filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))'
                    }}
                  >
                    {arcAnimation.currentTemp.to(val => `${Math.round(val)}°`)}
                  </animated.text>
                </g>
              )} */}



              {/* 溫度標籤 */}
              <animated.text
                x="40"
                y="373"
                fill="rgba(255, 255, 255, 0.8)"
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
              >
                {arcAnimation.minTemp.to(val => `${Math.round(val)}°`)}
              </animated.text>

              <animated.text
                x="40"
                y="32"
                fill="white"
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
              >
                {arcAnimation.maxTemp.to(val => `${Math.round(val)}°`)}
              </animated.text>


              {/* 漸變定義 */}
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(160, 160, 160, 0.8)" />
                  <stop offset="50%" stopColor="rgba(200, 200, 200, 0.9)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        <div style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            width: '200px',
            height: '290px',
            borderRadius: '350px 0 0 350px',
            overflow: 'hidden',
            position: 'absolute',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
        }}>
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
          }}>
            {getVisibleDays().map(({ day, index, offset }) => {
              const isCenter = offset === 0;
              const { weekday, dateStr } = formatDate(day.dt, index);
              const weatherType = iconCodeToType(day.weather?.[0]?.icon);
              const tempData = getTempRange(day);

              return (
                <div 
                  key={`${index}-${offset}`}
                  style={{
                      color: isCenter ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      fontSize: isCenter ? '1.2em' : Math.max(8, 14 - Math.abs(offset) * 2) + 'px',
                      fontWeight: isCenter ? '800' : '700',
                      opacity: Math.max(0.9, 1 - Math.abs(offset) * 0.1),
                      transform: `translateY(${offset * 30}px)`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      justifyContent: 'center',
                      paddingRight: isCenter ? '60px' : '40px',
                      width: '100%x',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      // filter: isCenter ? 'none' : `blur(${Math.abs(offset)*0.05}px)`,
                  }}
                  onClick={() => handleDayClick(index)}
                  >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  }}>
                    <div style={{
                      minWidth:'60px',
                      textAlign: 'left',
                    }}>
                      {weekday}
                      <div style={{
                        fontSize: '0.4em',
                        fontWeight: '600', 
                        paddingLeft: '2px'
                        }}
                      >
                        {dateStr}
                      </div>
                    </div>
                    {isCenter && (
                      <div>
                        <WeatherIcon type={weatherType} size="sm"/>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalWeekdaySelector;