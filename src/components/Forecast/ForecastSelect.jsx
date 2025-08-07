import React, { useState, useRef } from 'react';
import HeaderWithTime from '../Data/CurrentTime';

const VerticalWeekdaySelector = ({ 
    forecastData = [], // 包含 dt 屬性的物件
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
  
  return (
    
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translateY(0)',
        zIndex:500
    }}>
      <div
        style={{
          width: '200px',
          height: '390px',
          borderRadius: '350px 0 0 350px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        }}>
        <div 
          style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              width: '150px',
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

              return (
                <div 
                  key={`${index}-${offset}`}
                  style={{
                      color: isCenter ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      fontSize: isCenter ? '1.6em' : Math.max(8, 16 - Math.abs(offset) * 2) + 'px',
                      fontWeight: isCenter ? '800' : '700',
                      opacity: Math.max(0.9, 1 - Math.abs(offset) * 0.1),
                      transform: `translateY(${offset * 20}px)`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      justifyContent: 'center',
                      paddingRight: isCenter ? '110px' : '40px',
                      width: '100%',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      filter: isCenter ? 'none' : `blur(${Math.abs(offset)*0.05}px)`,
                  }}
                  onClick={() => handleDayClick(index)}
                  >
                  <div>
                    {weekday}
                    <div style={{
                      fontSize: '0.4em',
                      fontWeight: '600' 
                      }}
                    >
                      {dateStr}
                    </div>
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