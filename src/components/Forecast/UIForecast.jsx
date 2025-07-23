// components/ForecastDisplay.jsx
import React from "react";

const ForecastDisplay = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return <p>Loading forecast...</p>;
  }

  const formatDate = (timestamp, index) => {
    const date = new Date(timestamp * 1000);
    
    if (index === 0) {
      return "今天";
    } else if (index === 1) {
      return "明天";
    } else {
      // 顯示星期幾
      const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
      return weekdays[date.getDay()];
    }
  };

  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div className="forecast">
      <h3 style={{ marginBottom: "15px", color: "#333" }}>5天預報</h3>
      {forecast.map((day, index) => {
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const temp = Math.round(day.temp.day);
        const description = day.weather[0].description;

        return (
          <div key={index} className="forecast-item-detailed">
            <div className="forecast-date">
              <div className="day-name">{formatDate(day.dt, index)}</div>
              <div className="date-number">{formatFullDate(day.dt)}</div>
            </div>
            
            <div className="forecast-icon">
              <img src={iconUrl} alt={description} width="50" height="50" />
            </div>
            
            <div className="forecast-temp">
              <span className="temp-high">{temp}°C</span>
            </div>
            
            <div className="forecast-desc">
              {description}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        .forecast {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .forecast-item-detailed {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .forecast-item-detailed:last-child {
          border-bottom: none;
        }
        
        .forecast-date {
          flex: 1;
          text-align: left;
        }
        
        .day-name {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }
        
        .date-number {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }
        
        .forecast-icon {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .forecast-icon img {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .forecast-temp {
          flex: 1;
          text-align: center;
        }
        
        .temp-high {
          font-weight: 600;
          font-size: 18px;
          color: #333;
        }
        
        .forecast-desc {
          flex: 1.5;
          text-align: right;
          font-size: 14px;
          color: #666;
          text-transform: capitalize;
        }
        
        @media (max-width: 768px) {
          .forecast-item-detailed {
            padding: 10px 0;
          }
          
          .forecast-desc {
            display: none;
          }
          
          .forecast-icon img {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForecastDisplay;