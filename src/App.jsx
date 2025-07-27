import { useState, useEffect } from 'react'
import './App.css'
import HeaderWithTime from './components/CurrentTime.jsx';
import Search from './components/Search.jsx';
import Collection from './components/collection/Collection.jsx';
import useForecast from './components/Forecast/Forecast.jsx';
import ForecastDisplay from './components/Forecast/UIForecast.jsx';
import useHourlyForecast from './components/Forecast/HourlyForecast.jsx';
import HourlyForecastDisplay from './components/Forecast/UIHourlyForecast.jsx';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [searchStart, setSearchStart] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('banqiao');
  const [favorites, setFavorites] = useState([]);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false)
  const forecast = useForecast(query, API_KEY);
  const hourlyForecast = useHourlyForecast(query, API_KEY);

  useEffect(() => {
    console.log("query 更新：", query);
  }, [query]);  

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setQuery(coords);
        },
        (error) => {
          alert('無法取得您的位置');
          console.error(error);
        }
      );
    } else {
      alert('您的瀏覽器不支援地理位置功能');
    }
  };
  
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Taipei&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setWeather(data);
      })
  }, [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setQuery(coords);
      });
    }
  }, []);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let url = "";
        if (typeof query === "string") {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
        } else {
          const { lat, lon } = query;
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setWeather(data);
          setError("");
          setCity("");
        } else {
          setWeather(null);
          setError("❗ 查無此地區，請重新輸入");
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }
      } catch (err) {
        console.error("API 錯誤：", err);
        setWeather(null);
        setError("❗ 查無此地區，請重新輸入");
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    };
    fetchWeather();
  }, [query]);
  
  const addFavorite = () => {
    if (!weather) return;
    if (!favorites.some(f => f.name === weather.name)) {
      const newFavorite = {
        name: weather.name,
        temp: weather.main.temp
      };
      setFavorites([...favorites, newFavorite]);
    }
  };
  
  const removeFavorite = (cityName) => {
    const newFavorites = favorites.filter(c => c.name !== cityName);
    setFavorites(newFavorites);
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('favorites')) || [];
      if (Array.isArray(saved)) {
        setFavorites(saved);
      }
    } catch (e) {
      console.error("讀取 localStorage 失敗：", e);
      setFavorites([]);
    } finally {
      setHasLoadedFavorites(true);
    }
  }, []);
  
  useEffect(() => {
    if (hasLoadedFavorites) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, hasLoadedFavorites]);
  
  return (
    <div className="app-wrapper">

      {/* Navigation */}
      <div className='Nav'>
        <Search 
          city={city}
          setCity={setCity}
          setQuery={setQuery}
          searchStart={searchStart}
          setSearchStart={setSearchStart}
          error={error}
          shake={shake}
        />
        <div className='btn'>
          <button className="location-btn" onClick={handleGetLocation}>
            📍 Current Location
          </button>
          <button className='collectionBtn' onClick={addFavorite}>
            📌 Collection
          </button> 
        </div>
      </div>

      <div className='main row'>
        {/* Favorites Section */}
        <Collection 
          weather={weather}
          setQuery={setQuery}
          favorites={favorites}
          setFavorites={setFavorites}
          removeFavorite={removeFavorite}
        />
          
        <div className='weather col-18'>
          {/* Weather Content */}
          <div className="weather-content">
            
            {/* Current Weather */}
            <section className="current-weather col-18">
              {weather ? (
                <>
                  <h1 className='cityName'>{weather.name}</h1>
                  <h2 className='current-temp'>{Math.round(weather.main.temp)}°</h2>
                  <HeaderWithTime />
                </>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>Loading...</p>
              )}
            </section>

            <div className='weather-container'>
              
              {/* 5 Day Forecast */}
              <div className="forecast-section col-6">
                <ForecastDisplay forecast={forecast} />
              </div>

              {/* Hourly Forecast */}
              <div className="hourly-section col-12">
                <HourlyForecastDisplay 
                data={hourlyForecast} 
                cityName={weather?.name} 
                />
                
                {/* Weather Details Grid */}
                <div className="weather-details col-12">
                  {/* Feels Like */}
                  <div className="weather-card col-6">
                    <h3>體感溫度</h3>
                    {weather && (
                      <p>{Math.round(weather.main.feels_like)}°</p>
                    )}
                  </div>

                  {/* UV Index */}
                  <div className="weather-card col-6">
                    <h3>UV指數</h3>
                    <p>中等</p>
                  </div>

                  {/* Rain Chance */}
                  <div className="weather-card col-6">
                    <h3>降雨機率</h3>
                    {weather && (
                      <p>{Math.round((weather.clouds?.all || 0) / 2)}%</p>
                    )}
                  </div>

                  {/* Wind */}
                  <div className="weather-card col-6">
                    <h3>風速</h3>
                    {weather && (
                      <p>{(weather.wind?.speed * 3.6).toFixed(1)} km/h</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App