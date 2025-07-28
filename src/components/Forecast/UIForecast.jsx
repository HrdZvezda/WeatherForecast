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
    <section className="forecast col-6">
      <h3 style={{ 
        marginBottom: "15px", 
        color: "#333",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "600"
      }}>
        5天預報
      </h3>
      
      {forecast.map((day, index) => {
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const temp = Math.round(day.temp.day);
        const description = day.weather[0].description;

        return (
          <div key={index} className="forecast-item-detailed">
            {/* 日期區域 - 固定寬度 */}
            <div className="forecast-date">
              <div className="day-name">{formatDate(day.dt, index)}</div>
              <div className="date-number">{formatFullDate(day.dt)}</div>
            </div>
            
            {/* 天氣圖標 - 固定寬度居中 */}
            <div className="forecast-icon">
              <img src={iconUrl} alt={description} />
            </div>
            
            {/* 溫度 - 固定寬度居中 */}
            <div className="forecast-temp">
              <span className="temp-high">{temp}°C</span>
            </div>
            
            {/* 天氣描述 - 剩餘空間 */}
            <div className="forecast-desc">
              {description}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        .forecast {
          /* border:1px solid #000; */
          background: #f8f9fa;
          border-radius: 12px;
          max-height: 90.5%;
          padding: 16px;
          margin-top: 10px;
          margin-right: 8px;
          margin-left: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        
        .forecast::-webkit-scrollbar {
          display: none;
        }
        
        .forecast-item-detailed {
          display: grid;
          grid-template-columns: 60px 50px 60px 1fr;
          align-items: center;
          gap: 8px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(184, 186, 187, 0.3);
          min-height: 60px;
        }
        
        .forecast-item-detailed:last-child {
          border-bottom: none;
        }
        
        .forecast-date {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          width: 60px;
        }
        
        .day-name {
          font-weight: 600;
          font-size: 15px;
          color: #333;
          line-height: 1.2;
          white-space: nowrap;
        }
        
        .date-number {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
          line-height: 1;
        }
        
        .forecast-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
        }
        
        .forecast-icon img {
          width: 44px;
          height: 44px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .forecast-temp {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
        }
        
        .temp-high {
          font-weight: 600;
          font-size: 16px;
          color: #333;
          white-space: nowrap;
        }
        
        .forecast-desc {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #666;
          text-transform: capitalize;
          line-height: 1.3;
          padding-left: 4px;
        }
        
        /* 針對中文天氣描述的優化 */
        .forecast-desc {
          text-align: center;
        }
        
      `}</style>
    </section>
  );
};

export default ForecastDisplay;