import React from 'react';
import useCurrentTemp from '../CurrentTemp';
import HeaderWithTime from '../CurrentTime';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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
      <div className="favorite-info">
        <div className="collectionCity">{city.name}</div>
      </div>
      
      <div className="collectionRight">
        <p className="temp">
          {temp !== null ? `${Math.round(temp)}°` : `${Math.round(city.temp)}°`}
        </p>
        <div className="collection-buttons">
          <button 
            onClick={handleRemove}
            title="移除收藏"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;