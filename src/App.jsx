import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // 使用環境變數來存儲API金鑰 



function App() {
  
 
  const [searchStart, setSearchStart] = useState(false);
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('Taipei');

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setQuery(coords); // 這裡會觸發 useEffect 去抓 API
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
        setWeather(data);})
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      let url = '';
  
      if (typeof query === 'string') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
      } else {
        const { lat, lon } = query;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      }
  
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    };
  
    fetchWeather();
  }, [query]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setQuery(coords); // 將座標傳入 query
      });
    }
  }, []);
  
  


  return (
    <>
    {/*  */}
      <div className="app-wrapper">

        {/* nav */}
        <div className='container'>
          <div className='search'>
            <i onClick={() => setSearchStart(!searchStart)} className="fa-solid fa-magnifying-glass"></i>
            {/* <input className={searchStart ? 'open' : '' } type='text' placeholder='Search'/> */}
            <input
              className={searchStart ? 'open' : ''}
              type='text'
              placeholder='Search'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setQuery(city);
                  setCity('');
                }
              }}
            />
          </div>
          <button className="location-btn" onClick={handleGetLocation}>
            📍 Current Location
          </button>


        </div>

        


        {/* 🌤️ current weather區塊 */}
        <div className="current-weather">
          {weather ? (
            <>
              <h2 className='cityName'>{weather.name}</h2>
              <p>🌡️ {weather.main.temp}°C | {weather.weather[0].description}</p>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed}</p>            
              <p>Clouds: {weather.clouds.all}</p>
              <p>Feels Like: {weather.main.feels_like}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* 🔮 未來預報區塊 */}
        <div className="forecast">
          <div className="forecast-item">Mon - 🌥️ - 29°C</div>
          <div className="forecast-item">Tue - 🌧️ - 25°C</div>
          <div className="forecast-item">Wed - ☀️ - 30°C</div>
        </div>
      </div>
    </>
  );
}

export default App
