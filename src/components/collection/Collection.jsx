import React, { useState } from 'react';
import FavoriteItem from './favItems';

const Collection = ({ favorites, setQuery, removeFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="favorites">
      {/* 收藏標題區 - 可點擊展開收合 */}
      <div 
        className="favorites-header"
        onClick={toggleExpansion}
      >
        <h2 className="title">我的收藏</h2>
        <div className="favorites-toggle">
          <span className="favorites-count">{favorites.length}</span>
          <svg 
            className={`toggle-icon ${isExpanded ? 'expanded' : 'collapsed'}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>

      {/* 收藏列表區 - 可展開收合 */}
      <div className={`favorites-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <p>尚未收藏任何地區</p>
          </div>
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
    </section>
  );
};

export default Collection;