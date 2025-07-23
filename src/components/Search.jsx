// src/components/Search.jsx
import React from 'react';

const Search = ({ city, setCity, setQuery, searchStart, setSearchStart, error, shake }) => {

  return (
    <div className='search'>
      <i
        onClick={() => setSearchStart(!searchStart)}
        className="fa-solid fa-magnifying-glass"
      ></i>
      <input
        className={`${searchStart ? 'open' : ''} ${error ? 'input-error' : ''} ${shake ? 'shake' : ''}`}
        type='text'
        placeholder='Search'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setQuery(city);
          }
        }}
      />
    </div>
  );
};

export default Search;
