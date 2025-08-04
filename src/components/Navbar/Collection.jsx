import React, { useState, useEffect } from 'react';
import useCurrentTemp from '../CurrentTemp';
import { LocalStorageManager } from '../LocalStorage';
import { APP_CONFIG } from '../Data/Constant.jsx';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 載入收藏
  useEffect(() => {
    const saved = LocalStorageManager.get(APP_CONFIG.STORAGE_KEYS.FAVORITES, []);
    if (Array.isArray(saved)) {
      setFavorites(saved);
    }
    setHasLoaded(true);
  }, []);

  // 儲存收藏
  useEffect(() => {
    if (hasLoaded) {
      LocalStorageManager.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, favorites);
    }
  }, [favorites, hasLoaded]);

  const addFavorite = (weather) => {
    if (!weather || favorites.some(f => f.name === weather.name)) return;
    const newFavorite = {
      name: weather.name,
      temp: weather.main.temp,
      addedAt: new Date().toISOString()
    };
    setFavorites(prev => [...prev, newFavorite]);
  };

  const removeFavorite = (cityName) => {
    setFavorites(prev => prev.filter(f => f.name !== cityName));
  };

  const isFavorite = (cityName) => {
    return favorites.some(f => f.name === cityName);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    hasLoaded
  };
}

const FavoriteItem = ({ city, onSelect, onRemove }) => {
  const temp = useCurrentTemp(city.name, API_KEY);

  const handleSelect = (e) => {
    // 如果點擊的是刪除按鈕，不要觸發選擇
    if (e.target.closest('.collection-buttons') || e.target.closest('button')) {
      return;
    }
    console.log('點擊城市:', city.name); 
    onSelect(city.name);
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // 防止觸發父元素的點擊事件
    e.preventDefault();
    console.log('刪除城市:', city.name); 
    // Fix: Make sure onRemove is called with the correct parameter
    if (onRemove && typeof onRemove === 'function') {
      onRemove(city.name);
    }
  };

  // 根據天氣狀況獲取天氣描述
  const getWeatherCondition = (temp) => {
    if (temp > 30) return 'sunny';
    if (temp > 25) return 'partly-cloudy';
    if (temp > 15) return 'cloudy';
    if (temp > 5) return 'rainy';
    return 'cold';
  };

  // const getWeatherText = (condition) => {
  //   const weatherMap = {
  //     'sunny': '晴朗',
  //     'partly-cloudy': '多雲',
  //     'cloudy': '陰天',
  //     'rainy': '雨天',
  //     'cold': '寒冷'
  //   };
  //   return weatherMap[condition] || '未知';
  // };

  const currentTemp = temp !== null ? temp : city.temp;
  const weatherCondition = getWeatherCondition(currentTemp);
  // const weatherText = getWeatherText(weatherCondition);

  return (
    <div className="favorite-item" onClick={handleSelect}>
      <div className="favorite-info">
        <div className="collectionCity">{city.name}</div>
        <div className="weather-condition">{weatherCondition}</div>
      </div>
      
      <div className="collectionRight">
        <div className="temp">{Math.round(currentTemp)}°</div>
        <div className="collection-buttons">
          <button onClick={handleRemove}>x</button>
        </div>
      </div>
    </div>
  );
};

const Collection = ({ favorites, setQuery, removeFavorite, onSelect }) => {

  const handleCitySelect = (cityName) => {
    console.log('Collection handleCitySelect 被調用:', cityName); // 調試用
    setQuery(cityName);
    if (onSelect) {
      onSelect(cityName);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="favorites">
      <div className="favorites-header" onClick={toggleExpanded}>
        <h3 className="title">我的收藏</h3>
        <div className="favorites-toggle">
          <span className="favorites-count">{favorites.length}</span>
        </div>
      </div>

      <div className='favorites-content'>
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <p>尚未收藏任何地區</p>
            <small>搜尋並收藏你關心的城市天氣</small>
          </div>
        ) : (
          favorites.map(city => (
            <FavoriteItem
              key={city.name}
              city={city}
              onSelect={handleCitySelect}
              onRemove={removeFavorite}
            />
          ))
        )}
      </div>

      <style>{`
        .favorites {
          text-align: left;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          background: transparent;
          display: flex;
          flex-direction: column;
        }

        .favorites-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          user-select: none;
          position: relative;
        }

        .favorites-header:hover {
          background-color: transparent;
        }

        .favorites-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #ccc;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .favorites-header:hover::after {
          width: 30px;
        }

        .favorites .title {
          font-size: 20px;
          margin: 0;
          font-weight: 600;
          color: #f0f0f0ce;
        }

        .favorites-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .favorites-count {
          font-size: 14px;
          color: #666;
          background: #f0f0f0ce;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        .favorites-content {
          position: relative;
          transition: all 0.3s ease;
        }


        .favorites-content.expanded::after {
          content: '';
          position: sticky;
          bottom: 0;
          display: block;
          height: 20px;
          background: transparent;
          pointer-events: none;
          margin-top: -20px;
        }

        .favorites-content {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }

        .empty-favorites {
          padding: 20px 16px;
          text-align: center;
          color: #666;
        }

        .empty-favorites p {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .empty-favorites small {
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }

        .favorite-item {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          margin: 0;
          padding: 12px 16px;
          // background: white;
          border-bottom: 1px solid #f0f0f0ce;
          transition: background-color 0.2s;
          min-height: 60px;
          cursor: pointer;
        }

        .favorite-item:last-child {
          border-bottom: none;
        }

        .favorite-item:hover {
          background-color: #f0f0f0cd;
        }

        .favorite-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .collectionCity {
          font-size: 16px;
          margin: 0px 4px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
        }

        .weather-condition {
          font-size: 14px;
          color: #666;
          margin: 0px 4px;
        }

        .collectionRight {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .collectionRight .temp {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          margin: 4px;
          color: #222;
          white-space: nowrap;
        }

        .collection-buttons {
          display: flex;
          gap: 6px;
          justify-content: center;
          align-items: center;
          margin-top: 4px;
          flex-wrap: nowrap;
        }

        .favorite-item button {
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          color: #666;
          background: #f0f0f0;
          border: none;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .favorite-item button:hover {
          background-color: #ff4757;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Collection;