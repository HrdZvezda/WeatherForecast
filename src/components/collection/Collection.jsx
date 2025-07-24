import React from 'react';
import FavoriteItem from './favItems';

const Collection = ({ favorites, setQuery, removeFavorite }) => {
  return (
    <div className="favorites">
      {favorites.length === 0 ? (
        <p>尚未收藏任何地區</p>
      ) : (
        favorites.map(city => (
          <FavoriteItem
            key={city.name}
            city={city}
            onSelect={setQuery}
            onRemove={removeFavorite}
          />
        ))
      )}
    </div>
  );
};

export default Collection;
