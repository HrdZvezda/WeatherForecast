import React, { useState } from 'react';


const Search = ({ city, setCity, setQuery,  error }) => {

  const [searchStart, setSearchStart] = useState(false);

  const handleSearch = () => {
    if (!city || city.trim() === '') return;
    setQuery(city);
  };
  
  return (
    <div className='search'>
      <i
        onClick={() => setSearchStart(!searchStart)}
        className="fa-solid fa-magnifying-glass search-outline"
      ></i>
      <input
        className={`${searchStart ? 'open' : ''} ${error ? 'input-error' : ''}`}
        type='text'
        placeholder='Search'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
  );
};

export default Search;
