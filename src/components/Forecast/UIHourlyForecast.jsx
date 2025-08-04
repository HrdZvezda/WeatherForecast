import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const HourlyForecastDisplay = ({ data, cityName }) => {
  if (!data || data.length === 0) return <p>Loading hourly forecast...</p>;

  // 生成天氣警告訊息（可以根據實際數據動態生成）
  // const generateWeatherAlert = () => {
  //   const rainHour = data.find(hour => hour.pop > 0.3);
  //   const highWind = data.find(hour => hour.wind_speed > 8);
    
  //   if (rainHour && highWind) {
  //     const rainTime = new Date(rainHour.dt * 1000).getHours();
  //     const windSpeed = Math.round(highWind.wind_speed * 3.6); // m/s to km/h
  //     return `Rainy conditions expected around ${rainTime}PM. Wind gusts are up to ${windSpeed} km/h.`;
  //   } else if (rainHour) {
  //     const rainTime = new Date(rainHour.dt * 1000).getHours();
  //     return `Rainy conditions expected around ${rainTime}PM.`;
  //   } else if (highWind) {
  //     const windSpeed = Math.round(highWind.wind_speed * 3.6);
  //     return `Wind gusts are up to ${windSpeed} km/h.`;
  //   }
  //   return null;
  // };

  // const weatherAlert = generateWeatherAlert();

  // 格式化資料給 Recharts
  const chartData = data.slice(0, 12).map(hour => {
    const date = new Date(hour.dt * 1000);
    const hourLabel = date.getHours();
    const label =
      hourLabel === 0 ? "12AM" :
      hourLabel < 12 ? `${hourLabel}AM` :
      hourLabel === 12 ? "12PM" :
      `${hourLabel - 12}PM`;

    return {
      time: label,
      temperature: Math.round(hour.temp),
      pop: Math.round(hour.pop * 100), // 降雨機率百分比
      wind: Math.round(hour.wind_speed * 3.6), // m/s to km/h
    };
  });


  return (
    // <section style={{
    //   backgroundColor: '#4A5568',
    //   borderRadius: '12px',
    //   padding: '12px',
    //   color: 'white',
    //   marginBottom: '10px',
    //   fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    //   width:'100%',
    //   overflow:'scroll',
    //   height: 'auto',
    // }}>
    //   天氣警告訊息
    //   {weatherAlert && (
    //     <div style={{
    //       fontSize: '13px',
    //       marginBottom: '12px',
    //       padding: '6px 0',
    //       borderBottom: '1px solid rgba(255,255,255,0.2)'
    //     }}>
    //       {weatherAlert}
    //     </div>
    //   )}

    //   小時預報滾動區域/
    //   <div style={{
    //     overflowX: 'scroll',
    //     scrollbarWidth: 'none',
    //     msOverflowStyle: 'none'
    //   }}>
    //     <div style={{
    //       display: 'flex',
    //       gap: '16px',
    //       minWidth: 'max-content',
    //       paddingBottom: '6px'
    //     }}>
    //       {data.slice(0, 12).map((hour, index) => {
    //         const date = new Date(hour.dt * 1000);
    //         const hourStr = date.getHours();
    //         const isNow = index === 0;
            
    //         格式化時間顯示
    //         let timeDisplay;
    //         if (isNow) {
    //           timeDisplay = "Now";
    //         } else if (hourStr === 0) {
    //           timeDisplay = "12AM";
    //         } else if (hourStr < 12) {
    //           timeDisplay = `${hourStr}AM`;
    //         } else if (hourStr === 12) {
    //           timeDisplay = "12PM";
    //         } else {
    //           timeDisplay = `${hourStr - 12}PM`;
    //         }

    //         特殊時間標記（日出日落）
    //         const isSpecialTime = hourStr === 18 || hourStr === 6;
    //         const specialLabel = hourStr === 18 ? "Sunset" : hourStr === 6 ? "Sunrise" : null;

    //         const icon = hour.weather[0].icon;
    //         const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    //         const temp = Math.round(hour.temp);
    //         const pop = hour.pop > 0.1 ? `${Math.round(hour.pop * 100)}%` : null;

    //         return (
    //           <div
    //             key={index}
    //             style={{
    //               textAlign: 'center',
    //               minWidth: '50px',
    //               display: 'flex',
    //               flexDirection: 'column',
    //               alignItems: 'center',
    //               gap: '4px'
    //             }}
    //           >
    //             時間
    //             <div style={{
    //               fontSize: '12px',
    //               fontWeight: isNow ? 'bold' : 'normal',
    //               color: isNow ? '#FFF' : '#CBD5E0'
    //             }}>
    //               {timeDisplay}
    //             </div>

    //             天氣圖標
    //             <div style={{ position: 'relative' }}>
    //               <img 
    //                 src={iconUrl} 
    //                 alt="weather" 
    //                 style={{ 
    //                   width: '32px', 
    //                   height: '32px',
    //                   filter: 'brightness(1.1)'
    //                 }} 
    //               />
    //               特殊時間圖標
    //               {isSpecialTime && (
    //                 <div style={{
    //                   position: 'absolute',
    //                   bottom: '-4px',
    //                   left: '50%',
    //                   transform: 'translateX(-50%)',
    //                   fontSize: '16px'
    //                 }}>
    //                   {hourStr === 18 ? '🌅' : '🌇'}
    //                 </div>
    //               )}
    //             </div>

    //             溫度或特殊標記
    //             <div style={{
    //               fontSize: '14px',
    //               fontWeight: '600',
    //               color: '#FFF'
    //             }}>
    //               {specialLabel || `${temp}°`}
    //             </div>

    //             降雨機率
    //             {pop && (
    //               <div style={{
    //                 fontSize: '11px',
    //                 color: '#63B3ED',
    //                 fontWeight: '500'
    //               }}>
    //                 {pop}
    //               </div>
    //             )}
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>

    //   隱藏滾動條的 CSS
    //   <style jsx>{`
    //     div::-webkit-scrollbar {
    //       display: none;
    //     }
    //   `}</style>
    // </section>
    <section style={{ width: '100%', height: 300, marginBottom: '20px' }}>
      <h3 style={{ color: 'white', marginBottom: '8px' }}>
        {cityName} - Hourly Temperature Forecast
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#CBD5E0" />
          <YAxis 
            yAxisId="left" 
            stroke="#E53E3E" 
            domain={['auto', 'auto']} 
            label={{ value: '°C', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="temperature" 
            stroke="#E53E3E" 
            strokeWidth={2}
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }}
          />
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="pop"
            stroke="#4299E1"
            strokeDasharray="5 5"
            name="降雨機率 (%)"
          />

          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="wind"
            stroke="#38A169"
            name="風速 (km/h)"
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#CBD5E0" 
            label={{ value: '% / km/h', angle: 90, position: 'insideRight' }} 
          />


        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default HourlyForecastDisplay;