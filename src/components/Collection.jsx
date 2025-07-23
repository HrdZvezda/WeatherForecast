// src/components/Collection.jsx
import React from 'react';
import HeaderWithTime from './CurrentTime';
import useCurrentTemp from './CurrentTemp';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Collection = ({ favorites, setQuery, removeFavorite }) => {

  return (
    <div className="favorites">
      {favorites.length === 0 ? (
        <p>尚未收藏任何地區</p>
      ) : (
        favorites.map(city => {
          const currentTemp = useCurrentTemp(city.name, API_KEY); // ✅ 獲取即時溫度
          const displayTemp = currentTemp !== null ? Math.round(currentTemp) : Math.round(city.temp); // ✅ 優先使用即時溫度
          
          return(
            <div key={`${city.name}-${city.temp}`} className="favorite-item">
              <span className='collectionCity'>{city.name}
                <HeaderWithTime />
              </span>
              <div className='collectionRight'>
                <p className='temp'>{currentTemp !== null ? currentTemp.toFixed(1) : city.temp.toFixed(1)}°</p>
                <div className="collection-buttons">
                  <button onClick={() => setQuery(city.name)}>查看</button>
                  <button onClick={() => removeFavorite(city.name)}>刪除</button>
                </div>
              </div>
            </div>
          )  
        })
      )}
    </div>
  );
};

export default Collection;