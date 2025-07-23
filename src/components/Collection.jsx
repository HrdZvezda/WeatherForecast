// src/components/Collection.jsx
import React from 'react';
import HeaderWithTime from './CurrentTime';

const Collection = ({ favorites, setQuery, removeFavorite }) => {
  return (
    <div className="favorites">
      {favorites.length === 0 ? (
        <p>尚未收藏任何地區</p>
      ) : (
        favorites.map(city => (
          <div key={`${city.name}-${city.temp}`} className="favorite-item">
            <span className='collectionCity'>{city.name}
            <HeaderWithTime />
            </span>
            <div className='collectionRight'>
              <p className='temp'> {city.temp}°</p>
              <div className="collection-buttons">
                <button onClick={() => setQuery(city.name)}>查看</button>
                <button onClick={() => removeFavorite(city.name)}>刪除</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Collection;
