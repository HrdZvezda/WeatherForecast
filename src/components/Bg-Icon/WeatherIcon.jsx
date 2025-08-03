import React from "react";
import './WeatherIcon.css';

const WeatherIcon = ({ type, size = "mid" }) => {
  const sizeClass = `icon-${size}`;

  const renderIcon = (weatherClass, children) => (
    <div className={`icon ${weatherClass} ${sizeClass}`}>
      {children}
    </div>
  );

  switch (type) {
    case 'Sun-shower':
      return renderIcon("sun-shower", <>
        <div className="cloud"></div>
        <div className="sun"><div className="rays"></div></div>
        <div className="rain"></div>
      </>);

    case 'Thunderstorm':
      return renderIcon("thunder-storm", <>
        <div className="cloud"></div>
        <div className="lightning">
          <div className="bolt"></div>
          <div className="bolt"></div>
        </div>
      </>);

    case 'Clouds':
      return renderIcon("cloudy", <>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </>);

    case 'Snow':
      return renderIcon("flurries", <>
        <div className="cloud"></div>
        <div className="snow">
          <div className="flake"></div>
          <div className="flake"></div>
        </div>
      </>);

    case 'Clear':
      return renderIcon("sunny", <>
        <div className="sun"><div className="rays"></div></div>
      </>);

    case 'Rain':
      return renderIcon("rainy", <>
        <div className="cloud"></div>
        <div className="rain"></div>
      </>);

    default:
      return null;
  }
};

export default WeatherIcon;

// import React, { useState, useEffect } from 'react';

// // WeatherIcon 組件
// const WeatherIcon = ({ type, size = "mid" }) => {
//   const sizeClass = `icon-${size}`;

//   const renderIcon = (weatherClass, children) => (
//     <div className={`icon ${weatherClass} ${sizeClass}`}>
//       {children}
//     </div>
//   );

//   switch (type) {
//     case 'Sun-shower':
//       return renderIcon("sun-shower", <>
//         <div className="cloud"></div>
//         <div className="sun"><div className="rays"></div></div>
//         <div className="rain"></div>
//       </>);

//     case 'Thunderstorm':
//       return renderIcon("thunder-storm", <>
//         <div className="cloud"></div>
//         <div className="lightning">
//           <div className="bolt"></div>
//           <div className="bolt"></div>
//         </div>
//       </>);

//     case 'Clouds':
//       return renderIcon("cloudy", <>
//         <div className="cloud"></div>
//         <div className="cloud"></div>
//       </>);

//     case 'Snow':
//       return renderIcon("flurries", <>
//         <div className="cloud"></div>
//         <div className="snow">
//           <div className="flake">❄</div>
//           <div className="flake">❄</div>
//         </div>
//       </>);

//     case 'Clear':
//       return renderIcon("sunny", <>
//         <div className="sun"><div className="rays"></div></div>
//       </>);

//     case 'Rain':
//       return renderIcon("rainy", <>
//         <div className="cloud"></div>
//         <div className="rain"></div>
//       </>);

//     default:
//       return renderIcon("sunny", <>
//         <div className="sun"><div className="rays"></div></div>
//       </>);
//   }
// };

// // 天氣背景映射組件
// const WeatherBackground = ({ weather, children }) => {
//   // 根據 OpenWeatherMap API 的天氣條件映射到背景類型
//   const getWeatherBackground = (weatherData) => {
//     if (!weatherData) return 'clear';
    
//     const condition = weatherData.weather?.[0]?.main?.toLowerCase() || '';
//     const id = weatherData.weather?.[0]?.id || 800;
    
//     // 根據天氣ID和主要條件判斷
//     if (condition.includes('thunderstorm') || (id >= 200 && id < 300)) {
//       return 'stormy';
//     }
//     if (condition.includes('drizzle') || (id >= 300 && id < 400)) {
//       return 'rainy';
//     }
//     if (condition.includes('rain') || (id >= 500 && id < 600)) {
//       // 檢查是否有陽光（白天且雲量少）
//       const isDay = weatherData.weather?.[0]?.icon?.includes('d');
//       const clouds = weatherData.clouds?.all || 0;
//       if (isDay && clouds < 50) {
//         return 'sun-shower';
//       }
//       return 'rainy';
//     }
//     if (condition.includes('snow') || (id >= 600 && id < 700)) {
//       return 'snowy';
//     }
//     if (condition.includes('mist') || condition.includes('fog') || 
//         condition.includes('haze') || (id >= 700 && id < 800)) {
//       return 'foggy';
//     }
//     if (condition.includes('cloud') || (id >= 801 && id < 900)) {
//       return 'cloudy';
//     }
//     if (condition.includes('clear') || id === 800) {
//       return 'sunny';
//     }
    
//     return 'clear';
//   };

//   // 獲取 WeatherIcon 類型
//   const getWeatherIconType = (weatherData) => {
//     if (!weatherData) return 'Clear';
    
//     const condition = weatherData.weather?.[0]?.main || 'Clear';
//     const id = weatherData.weather?.[0]?.id || 800;
    
//     if (condition === 'Thunderstorm') return 'Thunderstorm';
//     if (condition === 'Rain') {
//       const isDay = weatherData.weather?.[0]?.icon?.includes('d');
//       const clouds = weatherData.clouds?.all || 0;
//       if (isDay && clouds < 50) return 'Sun-shower';
//       return 'Rain';
//     }
//     if (condition === 'Snow') return 'Snow';
//     if (condition === 'Clouds') return 'Clouds';
//     if (condition === 'Clear') return 'Clear';
    
//     return 'Clear';
//   };

//   const backgroundType = getWeatherBackground(weather);
//   const iconType = getWeatherIconType(weather);

//   // 創建雨滴動畫
//   const createRaindrops = () => {
//     const raindrops = [];
//     for (let i = 0; i < 80; i++) {
//       raindrops.push(
//         <div
//           key={i}
//           className="animated-raindrop"
//           style={{
//             left: `${Math.random() * 100}%`,
//             animationDuration: `${Math.random() * 1 + 0.5}s`,
//             animationDelay: `${Math.random() * 2}s`
//           }}
//         />
//       );
//     }
//     return raindrops;
//   };

//   // 創建雪花動畫
//   const createSnowflakes = () => {
//     const snowflakes = [];
//     for (let i = 0; i < 50; i++) {
//       snowflakes.push(
//         <div
//           key={i}
//           className="animated-snowflake"
//           style={{
//             left: `${Math.random() * 100}%`,
//             animationDuration: `${Math.random() * 3 + 2}s`,
//             animationDelay: `${Math.random() * 2}s`,
//             fontSize: `${Math.random() * 10 + 10}px`
//           }}
//         >
//           ❄
//         </div>
//       );
//     }
//     return snowflakes;
//   };

//   return (
//     <div className={`weather-background ${backgroundType}`}>
//       <style jsx>{`
//         .weather-background {
//           width: 100vw;
//           height: 100vh;
//           position: fixed;
//           top: 0;
//           left: 0;
//           transition: all 1.5s ease;
//           z-index: -1;
//         }

//         /* 背景樣式 */
//         .sunny {
//           background: linear-gradient(135deg, #87CEEB 0%, #98DDCA 50%, #D2B48C 100%);
//         }

//         .clear {
//           background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 50%, #87CEEB 100%);
//         }

//         .rainy {
//           background: linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #5D6D7E 100%);
//         }

//         .snowy {
//           background: linear-gradient(135deg, #E8F4FD 0%, #C3E0F0 50%, #A5C7E3 100%);
//         }

//         .cloudy {
//           background: linear-gradient(135deg, #BDC3C7 0%, #85929E 50%, #5D6D7E 100%);
//         }

//         .stormy {
//           background: linear-gradient(135deg, #1C2833 0%, #2C3E50 50%, #34495E 100%);
//           animation: lightning 4s infinite;
//         }

//         .sun-shower {
//           background: linear-gradient(135deg, #F7DC6F 0%, #85C1E9 50%, #5DADE2 100%);
//         }

//         .foggy {
//           background: linear-gradient(135deg, #D5DBDB 0%, #AEB6BF 50%, #85929E 100%);
//         }

//         @keyframes lightning {
//           0%, 85%, 100% { 
//             background: linear-gradient(135deg, #1C2833 0%, #2C3E50 50%, #34495E 100%); 
//           }
//           5%, 10%, 15%, 20% { 
//             background: linear-gradient(135deg, #ECF0F1 0%, #D5DBDB 50%, #AEB6BF 100%); 
//           }
//         }

//         /* 動畫雨滴 */
//         .animated-rain {
//           position: fixed;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           z-index: 0;
//           top: 0;
//           left: 0;
//         }

//         .animated-raindrop {
//           position: absolute;
//           background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3));
//           width: 2px;
//           height: 20px;
//           border-radius: 1px;
//           animation: fall linear infinite;
//         }

//         @keyframes fall {
//           from {
//             transform: translateY(-100vh);
//             opacity: 1;
//           }
//           to {
//             transform: translateY(100vh);
//             opacity: 0;
//           }
//         }

//         /* 動畫雪花 */
//         .animated-snow {
//           position: fixed;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           z-index: 0;
//           top: 0;
//           left: 0;
//         }

//         .animated-snowflake {
//           position: absolute;
//           color: white;
//           user-select: none;
//           pointer-events: none;
//           animation: snowfall linear infinite;
//           text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
//         }

//         @keyframes snowfall {
//           from {
//             transform: translateY(-100vh) rotate(0deg);
//             opacity: 1;
//           }
//           to {
//             transform: translateY(100vh) rotate(360deg);
//             opacity: 0.3;
//           }
//         }

//         /* 浮動雲朵 */
//         .floating-clouds {
//           position: fixed;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           z-index: 0;
//           top: 0;
//           left: 0;
//         }

//         .floating-cloud {
//           position: absolute;
//           background: rgba(255, 255, 255, 0.6);
//           border-radius: 50px;
//           opacity: 0.7;
//           animation: moveCloud linear infinite;
//         }

//         .floating-cloud:nth-child(1) {
//           width: 80px;
//           height: 30px;
//           top: 20%;
//           animation-duration: 25s;
//         }

//         .floating-cloud:nth-child(2) {
//           width: 60px;
//           height: 25px;
//           top: 30%;
//           animation-duration: 30s;
//           animation-delay: -10s;
//         }

//         .floating-cloud:nth-child(3) {
//           width: 90px;
//           height: 35px;
//           top: 15%;
//           animation-duration: 35s;
//           animation-delay: -20s;
//         }

//         .floating-cloud::before,
//         .floating-cloud::after {
//           content: '';
//           position: absolute;
//           background: rgba(255, 255, 255, 0.6);
//           border-radius: 50px;
//         }

//         .floating-cloud:nth-child(1)::before {
//           width: 40px;
//           height: 40px;
//           top: -20px;
//           left: 10px;
//         }

//         .floating-cloud:nth-child(1)::after {
//           width: 60px;
//           height: 35px;
//           top: -15px;
//           right: 10px;
//         }

//         @keyframes moveCloud {
//           from { 
//             transform: translateX(-100px); 
//           }
//           to { 
//             transform: translateX(calc(100vw + 100px)); 
//           }
//         }

//         /* 霧效果 */
//         .fog-effect {
//           position: fixed;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           z-index: 0;
//           top: 0;
//           left: 0;
//           background: linear-gradient(90deg, 
//             rgba(255, 255, 255, 0) 0%,
//             rgba(255, 255, 255, 0.3) 25%,
//             rgba(255, 255, 255, 0.6) 50%,
//             rgba(255, 255, 255, 0.3) 75%,
//             rgba(255, 255, 255, 0) 100%);
//           animation: fogMove 8s ease-in-out infinite;
//         }

//         @keyframes fogMove {
//           0%, 100% { transform: translateX(-50%); }
//           50% { transform: translateX(50%); }
//         }

//         /* WeatherIcon CSS 樣式 */
//         .weather-icon-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
//           margin-bottom: 20px;
//         }

//         .icon {
//           position: relative;
//           display: inline-block;
//           width: 12em;
//           height: 10em;
//           color: #4a90e2;
//         }

//         .icon-sm { font-size: 8px; }
//         .icon-mid { font-size: 15px; }
//         .icon-lg { font-size: 18px; }

//         .cloud {
//           position: absolute;
//           z-index: 1;
//           top: 50%;
//           left: 50%;
//           width: 3.6875em;
//           height: 3.6875em;
//           margin: -1.84375em;
//           background: currentColor;
//           border-radius: 50%;
//           box-shadow:
//             -2.1875em 0.6875em 0 -0.6875em,
//             2.0625em 0.9375em 0 -0.9375em,
//             0 0 0 0.375em #fff,
//             -2.1875em 0.6875em 0 -0.3125em #fff,
//             2.0625em 0.9375em 0 -0.5625em #fff;
//         }

//         .cloud:after {
//           content: '';
//           position: absolute;
//           bottom: 0;
//           left: -0.5em;
//           display: block;
//           width: 4.5625em;
//           height: 1em;
//           background: currentColor;
//           box-shadow: 0 0.4375em 0 -0.0625em #fff;
//         }

//         .cloud:nth-child(2) {
//           z-index: 0;
//           background: #fff;
//           box-shadow:
//             -2.1875em 0.6875em 0 -0.6875em #fff,
//             2.0625em 0.9375em 0 -0.9375em #fff,
//             0 0 0 0.375em #fff,
//             -2.1875em 0.6875em 0 -0.3125em #fff,
//             2.0625em 0.9375em 0 -0.5625em #fff;
//           opacity: 0.3;
//           transform: scale(0.5) translate(6em, -3em);
//           animation: cloud 4s linear infinite;
//         }

//         .cloud:nth-child(2):after { 
//           background: #fff; 
//         }

//         .sun {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           width: 2.5em;
//           height: 2.5em;
//           margin: -1.25em;
//           background: #FDB813;
//           border-radius: 50%;
//           box-shadow: 0 0 0 0.375em #fff;
//           animation: spin 12s infinite linear;
//         }

//         .rays {
//           position: absolute;
//           top: -2em;
//           left: 50%;
//           display: block;
//           width: 0.375em;
//           height: 1.125em;
//           margin-left: -0.1875em;
//           background: #fff;
//           border-radius: 0.25em;
//           box-shadow: 0 5.375em #fff;
//         }

//         .rays:before,
//         .rays:after {
//           content: '';
//           position: absolute;
//           top: 0em;
//           left: 0em;
//           display: block;
//           width: 0.375em;
//           height: 1.125em;
//           transform: rotate(60deg);
//           transform-origin: 50% 3.25em;
//           background: #fff;
//           border-radius: 0.25em;
//           box-shadow: 0 5.375em #fff;
//         }

//         .rays:before {
//           transform: rotate(120deg);
//         }

//         .cloud + .sun {
//           margin: -2em 1em;
//         }

//         .rain,
//         .lightning,
//         .snow {
//           background: transparent;
//           position: absolute;
//           z-index: 2;
//           top: 50%;
//           left: 50%;
//           width: 3.75em;
//           height: 3.75em;
//           margin: 0.375em 0 0 -2em;
//         }

//         .rain:after {
//           content: '';
//           position: absolute;
//           z-index: 2;
//           top: 50%;
//           left: 50%;
//           width: 1.125em;
//           height: 1.125em;
//           margin: -1em 0 0 -0.25em;
//           background: #0cf;
//           border-radius: 100% 0 60% 50% / 60% 0 100% 50%;
//           box-shadow:
//             0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),
//             -0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),
//             -1.375em -0.125em 0 rgba(255,255,255,0.2);
//           transform: rotate(-28deg);
//           animation: rain 3s linear infinite;
//         }

//         .bolt {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           margin: -0.25em 0 0 -0.125em;
//           color: #fff;
//           opacity: 0.3;
//           animation: lightning-bolt 2s linear infinite;
//         }

//         .bolt:nth-child(2) {
//           width: 0.5em;
//           height: 0.25em;
//           margin: -1.75em 0 0 -1.875em;
//           transform: translate(2.5em, 2.25em);
//           opacity: 0.2;
//           animation: lightning-bolt 1.5s linear infinite;
//         }

//         .bolt:before,
//         .bolt:after {
//           content: '';
//           position: absolute;
//           z-index: 2;
//           top: 50%;
//           left: 50%;
//           margin: -1.625em 0 0 -1.0125em;
//           border-top: 1.25em solid transparent;
//           border-right: 0.75em solid;
//           border-bottom: 0.75em solid;
//           border-left: 0.5em solid transparent;
//           transform: skewX(-10deg);
//         }

//         .bolt:after {
//           margin: -0.25em 0 0 -0.25em;
//           border-top: 0.75em solid;
//           border-right: 0.5em solid transparent;
//           border-bottom: 1.25em solid transparent;
//           border-left: 0.75em solid;
//           transform: skewX(-10deg);
//         }

//         .flake:before,
//         .flake:after {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           margin: -1.025em 0 0 -1.0125em;
//           color: #fff;
//           list-height: 1em;
//           opacity: 0.2;
//           animation: spin 8s linear infinite reverse;
//         }

//         .flake:after {
//           margin: 0.125em 0 0 -1em;
//           font-size: 1.5em;
//           opacity: 0.4;
//           animation: spin 14s linear infinite;
//         }

//         .flake:nth-child(2):before {
//           margin: -0.5em 0 0 0.25em;
//           font-size: 1.25em;
//           opacity: 0.2;
//           animation: spin 10s linear infinite;
//         }

//         .flake:nth-child(2):after {
//           margin: 0.375em 0 0 0.125em;
//           font-size: 2em;
//           opacity: 0.4;
//           animation: spin 16s linear infinite reverse;
//         }

//         @keyframes spin {
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes cloud {
//           0% { opacity: 0; }
//           50% { opacity: 0.3; }
//           100% {
//             opacity: 0;
//             transform: scale(0.5) translate(-200%, -3em);
//           }
//         }

//         @keyframes rain {
//           0% {
//             background: #0cf;
//             box-shadow:
//               0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),
//               -0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),
//               -1.375em -0.125em 0 #0cf;
//           }
//           25% {
//             box-shadow:
//               0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),
//               -0.875em 1.125em 0 -0.125em #0cf,
//               -1.375em -0.125em 0 rgba(255,255,255,0.2);
//           }
//           50% {
//             background: rgba(255,255,255,0.3);
//             box-shadow:
//               0.625em 0.875em 0 -0.125em #0cf,
//               -0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),
//               -1.375em -0.125em 0 rgba(255,255,255,0.2);
//           }
//           100% {
//             box-shadow:
//               0.625em 0.875em 0 -0.125em rgba(255,255,255,0.2),
//               -0.875em 1.125em 0 -0.125em rgba(255,255,255,0.2),
//               -1.375em -0.125em 0 #0cf;
//           }
//         }

//         @keyframes lightning-bolt {
//           45% {
//             color: #fff;
//             background: #fff;
//             opacity: 0.2;
//           }
//           50% {
//             color: #0cf;
//             background: #0cf;
//             opacity: 1;
//           }
//           55% {
//             color: #fff;
//             background: #fff;
//             opacity: 0.2;
//           }
//         }
//       `}</style>

//       {/* 背景動畫效果 */}
//       {(backgroundType === 'rainy' || backgroundType === 'stormy' || backgroundType === 'sun-shower') && (
//         <div className="animated-rain">
//           {createRaindrops()}
//         </div>
//       )}

//       {backgroundType === 'snowy' && (
//         <div className="animated-snow">
//           {createSnowflakes()}
//         </div>
//       )}

//       {(backgroundType === 'cloudy' || backgroundType === 'sun-shower') && (
//         <div className="floating-clouds">
//           <div className="floating-cloud"></div>
//           <div className="floating-cloud"></div>
//           <div className="floating-cloud"></div>
//         </div>
//       )}

//       {backgroundType === 'foggy' && (
//         <div className="fog-effect"></div>
//       )}

//       {/* 渲染子組件 */}
//       {children}

//       {/* WeatherIcon 顯示 */}
//       {weather && (
//         <div className="weather-icon-container" style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           zIndex: 1
//         }}>
//           <WeatherIcon type={iconType} size="lg" />
//         </div>
//       )}
//     </div>
//   );
// };

// // 模擬的天氣應用組件
// const WeatherApp = () => {
//   const [weather, setWeather] = useState(null);
//   const [city, setCity] = useState('台北');

//   // 模擬不同的天氣數據
//   const mockWeatherData = {
//     '台北': {
//       name: '台北',
//       main: { temp: 25, feels_like: 28 },
//       weather: [{ main: 'Clear', icon: '01d', id: 800 }],
//       clouds: { all: 10 }
//     },
//     '東京': {
//       name: '東京',
//       main: { temp: 18, feels_like: 20 },
//       weather: [{ main: 'Rain', icon: '10d', id: 500 }],
//       clouds: { all: 80 }
//     },
//     '紐約': {
//       name: '紐約',
//       main: { temp: -2, feels_like: -5 },
//       weather: [{ main: 'Snow', icon: '13d', id: 600 }],
//       clouds: { all: 90 }
//     },
//     '倫敦': {
//       name: '倫敦',
//       main: { temp: 15, feels_like: 17 },
//       weather: [{ main: 'Clouds', icon: '04d', id: 803 }],
//       clouds: { all: 75 }
//     },
//     '邁阿密': {
//       name: '邁阿密',
//       main: { temp: 16, feels_like: 18 },
//       weather: [{ main: 'Thunderstorm', icon: '11d', id: 200 }],
//       clouds: { all: 95 }
//     }
//   };

//   // 模擬獲取天氣數據
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setWeather(mockWeatherData[city]);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [city]);

//   // 每隔 10 秒自動切換城市（demo用）
//   useEffect(() => {
//     const cities = Object.keys(mockWeatherData);
//     let currentIndex = 0;

//     const interval = setInterval(() => {
//       currentIndex = (currentIndex + 1) % cities.length;
//       setCity(cities[currentIndex]);
//     }, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTemperature = (temp) => {
//     return `${Math.round(temp)}°C`;
//   };

//   return (
//     <WeatherBackground weather={weather}>
//       <div style={{
//         position: 'relative',
//         zIndex: 2,
//         color: 'white',
//         textAlign: 'center',
//         padding: '20px',
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         {/* 城市選擇（demo用） */}
//         <div style={{
//           position: 'fixed',
//           top: '20px',
//           left: '20px',
//           zIndex: 1000
//         }}>
//           <select 
//             value={city} 
//             onChange={(e) => setCity(e.target.value)}
//             style={{
//               padding: '8px 16px',
//               background: 'rgba(255, 255, 255, 0.2)',
//               border: '2px solid rgba(255, 255, 255, 0.3)',
//               borderRadius: '20px',
//               color: 'white',
//               backdropFilter: 'blur(10px)',
//               fontWeight: 'bold'
//             }}
//           >
//             {Object.keys(mockWeatherData).map(cityName => (
//               <option key={cityName} value={cityName} style={{color: 'black'}}>
//                 {cityName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 天氣信息 */}
//         {weather && (
//           <div style={{ marginTop: '200px' }}>
//             <h1 style={{
//               fontSize: '3rem',
//               fontWeight: '300',
//               margin: '0 0 10px 0',
//               textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
//             }}>
//               {weather.name}
//             </h1>
//             <h2 style={{
//               fontSize: '4rem',
//               fontWeight: '700',
//               margin: '0',
//               textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
//             }}>
//               {formatTemperature(weather.main.temp)}
//             </h2>
//             <p style={{
//               fontSize: '1.2rem',
//               margin: '10px 0',
//               opacity: 0.9,
//               textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
//             }}>
//               {weather.weather[0].main}
//             </p>
//           </div>
//         )}

//         <div style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           fontSize: '0.8rem',
//           opacity: 0.7
//         }}>
//           背景會根據天氣自動變化 | 每10秒切換一次城市
//         </div>
//       </div>
//     </WeatherBackground>
//   );
// };

// export default WeatherApp;