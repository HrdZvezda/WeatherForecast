import React, { useMemo, useEffect } from "react";
import WeatherIcon from "../Bg-Icon/WeatherIcon.jsx";

const Forecast5Day_CSS = `
  .f5-row{
    display:grid;
    grid-auto-flow:column;
    grid-auto-columns: calc((100% - 48px) / 4);
    gap:14px;
    padding: 6px;
    margin: 24px 0px 0px 0px;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
    scroll-snap-type:x mandatory;
  }
  .f5-row::-webkit-scrollbar{
    display:none
  }
  .f5-row::-webkit-scrollbar-thumb{
    background:rgba(0,0,0,.15);
    border-radius:6px
  }
  .f5-row > .f5-card{
    scroll-snap-align:start;
  }

  .f5-card{ 
    text-align:center;
    padding:16px 10px; 
    width:100%;
    border-radius:16px;
    backdrop-filter:blur(10px); 
    border:1px solid rgba(255,255,255,.3);
    transition:all .25s ease;
  }
  .f5-card:hover{
    border-color: rgba(59,130,246,.5);
    transform: translateY(-2px);
  }
  .f5-week{ 
    font-size:14px; 
    color:hsl(220, 9%, 70%); 
    margin-bottom:12px; 
    font-weight:500; 
  }
  .f5-icon{ 
    font-size:32px; 
    display:flex; 
    justify-content:center; 
    margin-bottom:10px;
  }
  .f5-tmax{ 
    font-size:18px; 
    font-weight:600; 
    color:hsl(220, 10%, 90%); 
    margin-bottom:4px; 
  }
  .f5-tmin{ 
    font-size:13px; 
    color:hsl(220, 9%, 60%); 
    margin-bottom:8px; 
  }
  .f5-desc{ 
    font-size:12px; 
    color:hsl(220, 9%, 60%); 
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis; 
  }
  
  @media (max-width: 1500px) {
    .f5-row {
      grid-auto-columns: calc((100% - 48px) / 5);
      gap:14px;
    }
  }
  @media (max-width: 1200px) {
    .f5-row {
      grid-auto-columns: calc((100% - 36px) / 4);
    }
  }
  @media (max-width: 600px) {
    .f5-desc{
      white-space:wrap; 
    }
  }
  @media (max-width: 500px) {
    .f5-week{
      font-size: 10px;
    }
  }
  @media (max-width: 400px) {
    .f5-week{
      font-size: 8px;
    }
    .f5-desc{
      font-size: 10px;
    }
  }

`;

function useBreakpointSizes() {
  const w600 = "(max-width: 600px)";
  const w500 = "(max-width: 500px)";

  const [state, setState] = React.useState({
    lt600: false, lt500: false,
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const m600 = window.matchMedia(w600);
    const m500 = window.matchMedia(w500);

    const apply = () => setState({
      lt600: m600.matches,
      lt500: m500.matches,
    });

    apply();
    const on600 = () => apply();
    const on500 = () => apply();

    m600.addEventListener ? m600.addEventListener("change", on600) : m600.addListener(on600);
    m500.addEventListener ? m500.addEventListener("change", on500) : m500.addListener(on500);

    return () => {
      m600.removeEventListener ? m600.removeEventListener("change", on600) : m600.removeListener(on600);
      m500.removeEventListener ? m500.removeEventListener("change", on500) : m500.removeListener(on500);
    };
  }, []);

  // 斷點優先順序：最小的優先
  if (state.lt500) return "sm";
  if (state.lt600) return "mid";
  return "lg";
}

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

const Weeks  = (ts) => ["Sunday","Monday","Tuesday","Wedsday","Thursday","Friday","Saturday"][new Date(ts*1000).getDay()];

/* 明天/星期 標籤 */
const labelFor = (ts) => {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
  const diff = Math.round((ts - today0) / 86400);
  return diff === 1 ? "Tomorrow" : Weeks (ts);
};

/* 把 /forecast 的 list[] 依天聚合並算 max/min */
const useFiveDays = (forecast) => useMemo(() => {
  if (!forecast) return [];

  // OneCall daily[] 直接用
  const daily = Array.isArray(forecast) ? forecast : forecast.daily;
  if (Array.isArray(daily) && daily[0]?.temp) {
    return daily.slice(1, 6).map(d => ({
      dt: d.dt,
      max: Math.round(d.temp?.max ?? d.temp?.day ?? NaN),
      min: Math.round(d.temp?.min ?? d.temp?.night ?? NaN),
      main: d.weather?.[0]?.main,
      icon: d.weather?.[0]?.icon,
      desc: d.weather?.[0]?.description,
    })).filter(d => Number.isFinite(d.max) && Number.isFinite(d.min));
  }

  // /forecast list[]
  const list = forecast.list ?? forecast;
  if (!Array.isArray(list)) return [];

  const buckets = new Map();
  for (const it of list) {
    const ts = (typeof it.dt === "number" ? it.dt : Date.parse(it.dt_txt) / 1000) || 0;
    const d = new Date(ts * 1000);
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000;

    const tMax = it?.main?.temp_max ?? it?.main?.temp;
    const tMin = it?.main?.temp_min ?? it?.main?.temp;
    if (!buckets.has(key)) buckets.set(key, { dt: key, max: -Infinity, min: Infinity, rep: null, repScore: -1e9 });
    const b = buckets.get(key);

    if (Number.isFinite(tMax)) b.max = Math.max(b.max, tMax);
    if (Number.isFinite(tMin)) b.min = Math.min(b.min, tMin);

    // 代表天氣取最接近 12:00 的時段
    const hour = new Date(ts * 1000).getHours();
    const score = -Math.abs(12 - hour);
    if (score > b.repScore) { b.repScore = score; b.rep = it; }
  }

  const todayKey = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()/1000;
  return [...buckets.values()]
    .sort((a,b)=>a.dt-b.dt)
    .filter(d => d.dt > todayKey)
    .slice(0,5)
    .map(b => {
      const rep = b.rep ?? {};
      return {
        dt: b.dt,
        max: Math.round(b.max),
        min: Math.round(b.min),
        main: rep.weather?.[0]?.main,
        icon: rep.weather?.[0]?.icon,
        desc: rep.weather?.[0]?.description,
      };
    })
    .filter(d => Number.isFinite(d.max) && Number.isFinite(d.min));
}, [forecast]);

export default function ForecastFiveDay({ forecast }) {
  const days = useFiveDays(forecast);
  const iconSize = useBreakpointSizes();

  if (!days.length) return null;

  return (
    <>
      <style>{Forecast5Day_CSS}</style>
      <div className="w-full mt-8 f5-row">
        {days.map((d, i) => (
          <div
          key={d.dt || i}
          className="f5-card"
          >
            <p className="f5-week">{labelFor(d.dt)}</p>
            <div className="f5-icon">
              <div>
                <WeatherIcon code={d.icon} size={iconSize} alt={d.desc} />
              </div>
            </div>
            <p className="f5-tmax">{d.max}°</p>
            <p className="f5-tmin">{d.min}°</p>
            {d.desc && <p className="f5-desc">{d.desc}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
