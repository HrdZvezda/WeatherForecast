import React, { useState, useEffect } from 'react';
import useCurrentTemp from '../CurrentTemp';
import { LocalStorageManager } from '../LocalStorage';
import { APP_CONFIG } from '../Constant';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// 從 Favorites.jsx 整合進來的 useFavorites hook
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

// 從 favItems.jsx 整合進來的 FavoriteItem 組件
const FavoriteItem = ({ city, onSelect, onRemove }) => {
  const temp = useCurrentTemp(city.name, API_KEY);

  const handleSelect = (e) => {
    // 如果點擊的是刪除按鈕，不要觸發選擇
    if (e.target.closest('.collection-buttons')) {
      return;
    }
    onSelect(city.name);
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // 防止觸發父元素的點擊事件
    onRemove(city.name);
  };

  return (
    <div className="favorite-item" onClick={handleSelect}>
      <div className="city-info">
        <span className="city-name">{city.name}</span>
        <span className="city-temp">
          {temp !== null ? `${Math.round(temp)}°` : `${Math.round(city.temp)}°`}
        </span>
      </div>
      <div className="collection-buttons">
        <button onClick={handleRemove} className="remove-button">
          ✕
        </button>
      </div>
    </div>
  );
};

// 原本的 Collection 組件保持不變
const Collection = ({ favorites, setQuery, removeFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCitySelect = (cityName) => {
    setQuery(cityName);
  };

  return (
    <div className="collection">
      {/* 收藏標題區 - 可點擊展開收合 */}
      <div className="collection-header" onClick={toggleExpansion}>
        <h3>我的收藏</h3>
        <span className="favorite-count">{favorites.length}</span>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {/* 收藏列表區 - 可展開收合 */}
      {isExpanded && (
        <div className="collection-content">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              尚未收藏任何地區
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
      )}
    </div>
  );
};

export default Collection;
