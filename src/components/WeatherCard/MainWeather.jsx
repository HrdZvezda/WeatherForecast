// src/components/WeatherCard/MainWeather.jsx
import React from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon";

const MW_CSS = `
  .mw-card{
    background: rgb(205, 203, 203);
    backdrop-filter: blur(16px);
    border-radius: 24px;
    padding: 24px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .mw-left{ display:flex; flex-direction:column; gap:6px; }
  .mw-temp{ font-size: clamp(44px, 7vw, 72px); font-weight:300; color:#1f2937; line-height:1; }
  .mw-today{ font-size:20px; color:#4b5563; margin-top:4px; }
  .mw-desc{ font-size:16px; color:#6b7280; text-transform:capitalize; }
  .mw-city{ font-size:13px; color:#9ca3af; }
  .mw-icon{ font-size: clamp(54px, 10vw, 96px); display:flex; align-items:center; }
`;

const toIconType = (main, icon) => {
  const m = (main || "").toLowerCase();
  if (m.includes("thunder")) return "Thunderstorm";
  if (m.includes("drizzle") || m.includes("rain")) {
    const isDay = icon?.endsWith("d");
    const isCloudy = ["02","03","04"].includes(icon?.slice(0,2));
    return isDay && isCloudy ? "Sun-shower" : "Rain";
  }
  if (m.includes("snow")) return "Snow";
  if (m.includes("cloud")) return "Clouds";
  if (m.includes("clear")) return "Clear";
  return "Clouds";
};

export default function MainCurrentCard({ weather }) {
  if (!weather) return null; 

  const temp = Math.round(weather.main?.temp ?? 0);
  const desc = weather.weather?.[0]?.description || weather.weather?.[0]?.main || "";
  const iconType = toIconType(weather.weather?.[0]?.main, weather.weather?.[0]?.icon);
  const city = weather.name || "";

  return (
    <>
      <style>{MW_CSS}</style>
      <div className="mw-card">
        <div className="mw-left">
          <div className="mw-temp">{temp}°C</div>
          <div className="mw-today">Today</div>
          <div className="mw-desc">{desc}</div>
          {city && <div className="mw-city">{city}</div>}
        </div>
        <div className="mw-icon">
          <WeatherIcon
            code={weather?.weather?.[0]?.icon}
            alt={weather?.weather?.[0]?.description}
            size="lg"
          />
        </div>
      </div>
    </>
  );
}
