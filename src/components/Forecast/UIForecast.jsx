import React from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";

const ForecastDisplay = ({ forecast }) => {
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
    } else if (index === 1) {
      return "Tomorrow";  
    } else {
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return weekdays[date.getDay()];
    }
  };

  // const getWeatherIcon = (iconCode) => {
  //   const iconMap = {
  //     '01d': '☀️', '01n': '🌙',
  //     '02d': '⛅', '02n': '☁️',
  //     '03d': '☁️', '03n': '☁️',
  //     '04d': '☁️', '04n': '☁️',
  //     '09d': '🌧️', '09n': '🌧️',
  //     '10d': '🌦️', '10n': '🌧️',
  //     '11d': '⛈️', '11n': '⛈️',
  //     '13d': '❄️', '13n': '❄️',
  //     '50d': '🌫️', '50n': '🌫️'
  //   };
  //   return iconMap[iconCode] || '☀️';
  // };

  // 計算溫度範圍（模擬最低和最高溫度）
  const getTempRange = (dayTemp) => {
    const temp = Math.round(dayTemp);
    const minTemp = temp - Math.floor(Math.random() * 8 + 3); // 低3-10度
    const maxTemp = temp + Math.floor(Math.random() * 5 + 2); // 高2-6度
    return { min: minTemp, max: maxTemp };
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

  return (
    <div className="compact-forecast">
      
      <div className="forecast-list">
        {forecast.map((day, index) => {
          const icon = day.weather[0].icon;
          // const weatherEmoji = getWeatherIcon(icon);
          const weatherType = iconCodeToType(icon);
          const dayName = formatDate(day.dt, index);
          const tempRange = getTempRange(day.temp.day);
          const tempPercent = ((tempRange.max - tempRange.min) / 20) * 100; // 溫度條百分比

          return (
            <div key={index} className={`forecast-item ${index === 0 ? 'today' : ''}`}>
              <div className="day-label">
                {dayName}
              </div>
              
              <div className="weather-icon">
                <WeatherIcon type={weatherType} size="sm"/>
              </div>
              
              <div className="temp-range">
                <span className="temp-min">{tempRange.min}°</span>
                
                <div className="temp-bar-container">
                  <div className="temp-bar">
                    <div 
                      className="temp-bar-fill"
                      style={{ width: `${Math.min(tempPercent, 85)}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className="temp-max">{tempRange.max}°</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .compact-forecast {
          /* background: rgba(255, 255, 255, 0.1); */
          /* border: 1px solid rgba(255, 255, 255, 0.2); */
          /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); */
          padding: 16px;
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

        .weather-icon {
          /* font-size: 24px; */
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
          overflow: hidden;
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
          position: relative;
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