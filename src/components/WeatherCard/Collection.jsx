import React, { useState, useEffect } from 'react';
import WeatherIcon from '../Bg-Icon/WeatherIcon.jsx';
import { LocalStorageManager } from '../Data/LocalStorage.jsx';
import { APP_CONFIG } from '../Data/Constant.jsx';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

/** 取城市即時：溫度/描述/icon 代碼（失敗則回傳空） */
const useCityWeatherBrief = (city, apiKey) => {
  const [state, setState] = React.useState({ temp: null, desc: '', icon: null });

  React.useEffect(() => {
    if (!city || !apiKey) return;
    let ignore = false;
    (async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
        const res = await fetch(url);
        const data = await res.json();
        if (!ignore && res.ok) {
          setState({
            temp: data?.main?.temp ?? null,
            desc: data?.weather?.[0]?.description || data?.weather?.[0]?.main || '',
            icon: data?.weather?.[0]?.icon || null,
          });
        }
      } catch { /* ignore */ }
    })();
    return () => { ignore = true; };
  }, [city, apiKey]);

  return state; // { temp, desc, icon }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 初始載入
  useEffect(() => {
    const saved = LocalStorageManager.get(APP_CONFIG.STORAGE_KEYS.FAVORITES, []);
    if (Array.isArray(saved)) setFavorites(saved);
    setHasLoaded(true);
  }, []);

  // 持久化
  useEffect(() => {
    if (hasLoaded) {
      LocalStorageManager.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, favorites);
    }
  }, [favorites, hasLoaded]);

  // Actions
  const addFavorite = (weather) => {
    if (!weather?.name) return;
    if (favorites.some(f => f.name === weather.name)) return;
    const newFav = {
      name: weather.name,
      temp: weather.main?.temp ?? null,
      addedAt: new Date().toISOString(),
    };
    setFavorites(prev => [...prev, newFav]);
  };

  const removeFavorite = (cityName) => {
    setFavorites(prev => prev.filter(f => f.name !== cityName));
  };

  const isFavorite = (cityName) => favorites.some(f => f.name === cityName);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

/** 單張卡片 */
const FavoriteCard = ({ city, onSelect, onRemove }) => {
  const { temp, desc, icon } = useCityWeatherBrief(city.name, API_KEY);

  const handleSelect = (e) => {
    if (e.target.closest('button')) return; // 點到按鈕不觸發切換
    onSelect?.(city.name);
  };
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(city.name);
  };

  const showTemp = Math.round((temp ?? city.temp) || 0);
  const textDesc = (desc || '').toLowerCase();

  return (
    <div className="fav-card" onClick={handleSelect} title={city.name}>
      <div className="fav-card-top">
        <div className="fav-icon">
          {/* 用官方 icon；列表視覺統一用日間版 */}
          <WeatherIcon code={icon} forceDay size={44} />
        </div>
        <button className="fav-remove" onClick={handleRemove} aria-label="Remove">×</button>
      </div>

      <div className="fav-city">{city.name}</div>

      <div className="fav-temp">
        <span className="fav-temp-val">{showTemp}</span>
        <span className="fav-temp-unit">°c</span>
      </div>

      <div className="fav-desc">{textDesc || '—'}</div>
    </div>
  );
};

const Collection = ({ favorites = [], setQuery, removeFavorite, onSelect }) => {
  const handleCitySelect = (name) => {
    setQuery?.(name);
    onSelect?.(name);
  };

  return (
    <div className="favorites-wrap">
      {/* 卡片式收藏區塊樣式 */}
      <style>{`
        .favorites-wrap{
          backdrop-filter: blur(10px);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          max-width: 100%;
        }

        /* Header */
        .favorites-header{
          display:flex; 
          align-items:center; 
          justify-content:space-between;
          padding:14px 16px;
          position:sticky; 
          top:0; 
          z-index:1;
          border-bottom:1px solid rgba(255,255,255,.22);
        }
        .favorites-title{ 
          font-size:18px; 
          font-weight:800; 
          color:hsl(220, 9%, 70%); 
          margin:0; 
          letter-spacing:.2px; 
        }
        .favorites-count{
          min-width:42px; 
          height:28px; 
          padding:0 12px;
          display:inline-flex; 
          align-items:center; 
          justify-content:center;
          font-size:14px; 
          font-weight:800; 
          color:#111827;
          background: linear-gradient(180deg,#fff,#f3f4f6);
          border:1px solid rgba(0,0,0,.08);
          border-radius:999px;
        }
        
        .favorites-toggle{
          font-size:12px; 
          color:hsl(220, 9%, 70%); 
          cursor:pointer; 
          padding:4px 8px; 
          border-radius:8px;
          transition: background .15s ease;
        }
        .favorites-toggle:hover{ 
          background: rgba(255,255,255,.1); 
        }

        .favorites-body{ 
          padding:14px; 
        }

        .favorites-scroll{
          display:grid;
          grid-auto-flow: column;
          gap:12px;
          grid-auto-columns: 190px;
          max-width:100%;
          overflow-x:scroll;
          padding:2px 8px 4px;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type:x mandatory;
          scrollbar-width: none;           /* Firefox */
          -ms-overflow-style: none;        /* IE/Edge */
        }
        .favorites-scroll::-webkit-scrollbar{ 
          display:none;                    /* Chrome/Safari */
        } 
  
          /* 單張卡片 */
        .fav-card{
          box-sizing: border-box;
          border-radius:20px; 
          padding:20px; 
          max-height:200px; 
          max-width:190px;
          backdrop-filter:blur(10px); 
          border:1px solid rgba(255,255,255,.3);
          transition:all .25s ease;
          scroll-snap-align:start; 
        }
        .fav-card:hover{
          border-color: rgba(59,130,246,.5);
          transform: translateY(-2px);
        }
        .fav-card-top{
          display:flex; 
          align-items:center; 
          justify-content:space-between;
        }
        .fav-icon{ 
          width:44px; 
          height:44px; 
          display:flex; 
          align-items:center; 
          justify-content:center; 
        }
        .fav-remove{
          width:28px; 
          height:28px; 
          border-radius:999px; 
          line-height:1; 
          font-size:16px; 
          font-weight:800;
          display:inline-flex; 
          align-items:center; 
          justify-content:center;
          color:hsl(220, 9%, 70%); 
          background: rgba(255,255,255,.85);
          border:1px solid rgba(0,0,0,.06);
          cursor:pointer; transition: all .15s ease;
        }
        .fav-remove:hover{ 
          color:#fff; 
          background:#ef4444; 
          border-color:#ef4444; 
          transform: translateY(-1px); 
        }

        .fav-city{
          margin-top:10px;
          font-size:15px; 
          font-weight:800; 
          color:hsl(220, 9%, 80%);
          white-space:nowrap;
          overflow:hidden; 
          text-overflow:ellipsis;
        }
        .fav-temp{
          display:flex; 
          align-items:baseline; 
          gap:4px; 
          margin-top:10px;
        }
        .fav-temp-val{ 
          font-size:28px; 
          font-weight:800; 
          color:hsl(220, 10%, 90%); 
          line-height:1; 
        }
        .fav-temp-unit{ 
          font-size:14px; 
          color:hsl(220, 9%, 70%); 
          line-height:1;
        }

        .fav-desc{
          margin-top:10px; 
          text-align:left;
          margin-bottom: 0px;
          font-size:12px; color:hsl(220, 9%, 70%); 
          text-transform:capitalize;
        }

        /* 空狀態 */
        .favorites-empty{
          padding:28px 12px; text-align:center;
        }
        .favorites-empty p{ 
          margin:0 0 6px 0; 
          font-size:15px; 
          font-weight:700; 
          color:hsl(220, 9%, 70%); 
        }
        .favorites-empty small{ 
          font-size:12px; 
          color:hsl(220, 9%, 60%); 
        }
      `}</style>

      <div className="favorites-header">
        <h3 className="favorites-title">City</h3>
        <span className="favorites-count" aria-label="favorites count">
          {favorites.length}
        </span>
      </div>


        <div className="favorites-body">
          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <p>尚未收藏任何地區</p>
              <small>搜尋並收藏你關心的城市天氣</small>
            </div>
          ) : (
            <div className="favorites-scroll">
              {favorites.map((city) => (
                <FavoriteCard
                  key={city.name}
                  city={city}
                  onSelect={(name) => setQuery?.(name)}
                  onRemove={removeFavorite}
                />
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default Collection;
