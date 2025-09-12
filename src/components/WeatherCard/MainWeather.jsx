// src/components/WeatherCard/MainWeather.jsx
import React, { useState }from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";
import HeaderWithTime from '../Data/CurrentTime';
import WeatherTempChart from "../WeatherCard/WeatherTempChart.jsx";
import { useI18n } from "../i18n/I18nContext";

const MW_CSS = `
  .mw-card{
    border:1px solid rgba(255,255,255,.3);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 24px;
    display:flex; 
    align-items:center; 
    justify-content:space-between;
    cursor: pointer;
  }
  .mw-left{ 
    display:flex; 
    flex-direction:column; 
    gap:6px; 
  }
  .mw-temp{ 
    font-size: clamp(44px, 7vw, 72px); 
    font-weight:300; 
    color:hsl(220, 10%, 90%); 
    line-height:1; 
  }
  .mw-today{ 
    font-size:20px; 
    color:hsl(220, 9%, 80%); 
    margin-top:4px; 
  }
  .mw-desc{ 
    font-size:16px; 
    color:hsl(220, 9%, 70%); 
    text-transform:capitalize; 
  }
  .mw-city{ 
    font-size:13px; 
    color:hsl(220, 9%, 60%); 
  }
  .mw-icon{ 
    font-size: clamp(54px, 10vw, 96px); 
    display:flex; 
    align-items:center; 
    justify-content:center;
    width: 96px; 
    height: 96px; 
  }
  


`;

// const toIconType = (main, icon) => {
//   const m = (main || "").toLowerCase();
//   if (m.includes("thunder")) return "Thunderstorm";
//   if (m.includes("drizzle") || m.includes("rain")) {
//     const isDay = icon?.endsWith("d");
//     const isCloudy = ["02","03","04"].includes(icon?.slice(0,2));
//     return isDay && isCloudy ? "Sun-shower" : "Rain";
//   }
//   if (m.includes("snow")) return "Snow";
//   if (m.includes("cloud")) return "Clouds";
//   if (m.includes("clear")) return "Clear";
//   return "Clouds";
// };

export default function MainCurrentCard({ weather, forecast }) {
  const [open, setOpen] = React.useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const { t, translateWeather } = useI18n(); // 新增 translateWeather

  if (!weather) return null; 
  const todayTs = new Date().setHours(0,0,0,0) / 1000;

  const temp = Math.round(weather.main?.temp ?? 0);
  const desc = translateWeather(weather.weather?.[0]?.description || weather.weather?.[0]?.main || "");
  const city = weather.name || "";
  // const iconType = toIconType(weather.weather?.[0]?.main, weather.weather?.[0]?.icon);

  return (
    <>
      <style>{MW_CSS}</style>
      <div 
        className="mw-card"
        onClick={(e) => {
          setOpen(true)
          setAnchorRect({
            ...e.currentTarget.getBoundingClientRect(),
            isToday: true
          });
        }}
      >
        <div className="mw-left">
          <div className="mw-temp">{temp}°C</div>
          <div className="mw-today">
            {t('today')}
          </div>
          <div className="main-time">
            <HeaderWithTime />
          </div>
          <div className="mw-desc">{desc}</div>
          {city && <div className="mw-city">{city}</div>}
        </div>
        <div className="mw-icon">
          <WeatherIcon
            code={weather?.weather?.[0]?.icon}
            alt={desc} 
            size="lg"
          />
        </div>
      </div>
      {open && (
        <WeatherTempChart
          forecast={forecast}
          dayTs={todayTs}
          anchorRect={anchorRect}
          onClose={()=>setOpen(false)}
        />
      )}
    </>
  );
}

