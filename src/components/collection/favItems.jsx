import React from 'react';
import useCurrentTemp from '../CurrentTemp';
import HeaderWithTime from '../CurrentTime';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const FavoriteItem = ({ city, onSelect, onRemove }) => {
  const temp = useCurrentTemp(city.name, API_KEY);

  return (
    <div className="favorite-item">
      <span className="collectionCity">
        {city.name}
        <HeaderWithTime />
      </span>
      <div className="collectionRight">
        <p className="temp">
          {temp !== null ? `${temp.toFixed(1)}°` : `${city.temp.toFixed(1)}°`}
        </p>
        <div className="collection-buttons">
          <button onClick={() => onSelect(city.name)}>查看</button>
          <button onClick={() => onRemove(city.name)}>刪除</button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;
