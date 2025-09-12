import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

const Search = ({ city, setCity, setQuery,  error }) => {

  const [searchStart, setSearchStart] = useState(false);
  const { t } = useI18n();

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
        placeholder={t('search.placeholder')}
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
