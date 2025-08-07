import React, { useState } from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";


const ForecastDisplay = ({ forecast, currentTemp }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="compact-forecast-loading">
        <p>Loading...</p>
      </div>
    );
  }

  const formatDate = (timestamp, index) => {
    const date = new Date(timestamp * 1000);
    
    if (index === 0) {
      return "Today";
    }  else {
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      return weekdays[date.getDay()];
    }
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
      // Fallback values
      min = 20;
      max = 25;
    }
    return {
      min: Math.round(min),
      max: Math.round(max)
    };
  };
  const calculateTempBar = (forecast) => {
    const allTemps = [];
    forecast.forEach(day => {
      const tempRange = getTempRange(day);
      allTemps.push(tempRange.min, tempRange.max);
    });
    const gap = 3;
    const globalMin = Math.min(...allTemps) - gap;
    const globalMax = Math.max(...allTemps) + gap;
    const tempRange = globalMax - globalMin || 10; // Prevent division by zero
  
    return forecast.map((day, index) => {
      const dayTempRange = getTempRange(day);
      const minTemp = dayTempRange.min;
      const maxTemp = dayTempRange.max;
      
      const startPercent = ((minTemp - globalMin) / tempRange) * 100;
      const widthPercent = ((maxTemp - minTemp) / tempRange) * 100;
      
      const currentTempPercent = (index === 0 && currentTemp != null)
      ? ((Math.max(globalMin, Math.min(globalMax, currentTemp)) - globalMin) / tempRange) * 100
      : null;
      
      return {
        min: minTemp,
        max: maxTemp,
        startPercent: Math.max(0, startPercent),
        widthPercent: Math.max(8, widthPercent),
        currentTempPercent
      }
    });
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
  
  const tempBarData = calculateTempBar(forecast, currentTemp);
  // console.log('currtemp',currentTemp);
  
  const descriptionMap = {
    'clear sky': 'Clear',
    'few clouds': 'Few',
    'scattered clouds': 'Scattered',
    'broken clouds': 'Broken',
    'overcast clouds': 'Cloudy',
    'light rain': 'Light Rain',
    'moderate rain': 'Rain',
    'heavy intensity rain': 'Rain+',
    'light snow': 'Snow',
    'mist': 'Mist',
    'fog': 'Fog',
    'thunderstorm': 'Storm'
  };
  

  return (
    <div className="compact-forecast">
      
      <div className="forecast-list">
        {forecast.map((day, index) => {
          const icon = day.weather[0].icon;
          const weatherType = iconCodeToType(icon);
          const dayName = formatDate(day.dt, index);
          const tempData = tempBarData[index];

          // RWD
          // 想要讓他縮小時可以 溫度條消失改成最高低溫度上下排 
          // 再小就變成只顯示某天 然後hover的時候跳出卡片式
          // 溫度進度條要改進準確
          // Icon雲朵顏色

          return (
            <div key={index} className={`forecast-item ${index === 0 ? 'today' : ''}`}>
              <div className="day-label">
                {dayName}<br/>
                <span className="weather-desc">
                  {descriptionMap[day.weather?.[0]?.description] || 
                  day.weather?.[0]?.main || 'Weather'}</span>
              </div>
              
              <div className="weather-icon">
                <WeatherIcon type={weatherType} size="sm"/>
              </div>
              
              <div className="temp-range">
                <span className="temp-min">{tempData.min}°</span>
                
                <div className="temp-bar-container">
                  <div className="temp-bar">
                    <div 
                      className="temp-bar-fill"
                      style={{ 
                        left: `${tempData.startPercent}%`,
                        width: `${tempData.widthPercent}%`
                      }}
                    ></div>

                    {index === 0 && tempData.currentTempPercent !== null && (
                      <>
                        <div 
                          className="current-temp-dot"
                          style={{ left: `${tempData.currentTempPercent}%` }}
                        ></div>
                        <div 
                          className="current-temp-line"
                          style={{ left: `${tempData.currentTempPercent}%` }}
                        ></div>
                        <div 
                          className="current-temp-label"
                          style={{ left: `${tempData.currentTempPercent}%` }}
                        >
                          {Math.round(currentTemp)}°
                          <div className="current-temp-arrow"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <span className="temp-max">{tempData.max}°</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .compact-forecast {
          padding: 12px;
          padding-right:0;
          width: 320px;
          position: absolute;
          top: 150px;
          right: 20px;
          z-index: 100;
        }

        .forecast-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .forecast-item {
          display: grid;
          grid-template-columns: 70px 50px 1fr;
          align-items: center;
          gap: 12px;
          padding: 12px 8px;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
        }

        .forecast-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .forecast-item.today {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .forecast-item.today::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 70%;
          background: linear-gradient(to bottom, #e7edf0cb, #abb0b3ab);
          border-radius: 2px;
        }

        .day-label {
          font-size: 14px;
          font-weight: 500;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          text-align: left;
        }

        .forecast-item.today .day-label {
          font-weight: 600;
          color: #E3F2FD;
        }

        .weather-desc{
          font-size: 0.7em;
          color: rgba(255, 255, 255, 0.5);

        }
        .weather-icon {
          text-align: center;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
        }

        .temp-range {
          display: grid;
          grid-template-columns: 32px 1fr 32px;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .temp-min, .temp-max {
          font-size: 13px;
          font-weight: 500;
          color: rgba(200, 200, 200, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .temp-max {
          color: white;
          font-weight: 600;
        }

        .temp-bar-container {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          /* overflow: hidden; */
          position: relative;
        }

        .temp-bar {
          height: 100%;
          width: 100%;
          position: relative;
        }

        .temp-bar-fill {
          height: 100%;
          background: linear-gradient(to right, 
            rgba(160, 160, 160, 0.6) 0%,
            rgba(200, 200, 200, 0.8) 30%,
            rgba(230, 230, 230, 0.9) 70%,
            rgba(255, 255, 255, 1) 100%
          );
          border-radius: 2px;
          transition: width 0.8s ease;
          position: absolute;
        }

        .forecast-item.today .temp-bar-fill {
          background: linear-gradient(to right, 
            rgba(180, 180, 180, 0.7) 0%,
            rgba(210, 210, 210, 0.9) 30%,
            rgba(240, 240, 240, 1) 70%,
            rgba(255, 255, 255, 1) 100%
          );
          box-shadow: 0 0 8px  rgba(255, 255, 255, 0.4);
        }

        .current-temp-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: hsl(0, 0%, 30%);
          border: 2px solid hsl(0, 0%, 40%) ;
          border-radius: 50%;
          /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); */
          z-index: 10;
        }

        .current-temp-label {
          position: absolute;
          top: -32px;
          transform: translateX(-50%);
          background: #ffffff9e;
          color: black;
          font-size: 12px;
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 10;
          white-space: nowrap;
        }

        .current-temp-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 6px solid #ffffff9e;;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }


        .compact-forecast-loading {
          background:  rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          width: 320px;
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
          text-align: center;
        }

        .compact-forecast-loading p {
          margin: 0;
          color: white;
          font-size: 14px;
          opacity: 0.8;
        }


      `}</style>
    </div>
  );
};

export default ForecastDisplay;