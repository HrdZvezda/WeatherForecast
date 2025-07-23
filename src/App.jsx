import { useState, useEffect } from 'react'
import './App.css'
import HeaderWithTime from './components/CurrentTime.jsx';
import Search from './components/Search.jsx';
import Collection from './components/Collection.jsx';
import useForecast from './components/Forecast.jsx';


const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // 使用環境變數來存儲API金鑰 



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
          setError("");              // ✅ 清除錯誤
          setCity("");              // ✅ 成功後才清空輸入框
        } else {
          setWeather(null);
          setError("❗ 查無此地區，請重新輸入");
          setShake(true); // 加入 shake
          setTimeout(() => setShake(false), 300); // 300ms 與動畫時間一致
        }
      } catch (err) {
        console.error("API 錯誤：", err);
        setWeather(null);
        setError("❗ 查無此地區，請重新輸入");
        setShake(true); // 加入 shake
        setTimeout(() => setShake(false), 300); // 300ms 與動畫時間一致
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
    setFavorites(newFavorites); // ✅ 更新狀態就會觸發 localStorage 更新
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
    <>
    {/*  */}
      <div className="app-wrapper">

        {/* nav */}
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

        <div className='main'>
          {/* 🌤️ favorites區塊 */}
          <Collection 
          weather={weather}
          setQuery={setQuery}
          favorites={favorites}
          setFavorites={setFavorites}
          removeFavorite={removeFavorite}
          />
            
          <div className='weather'>

            {/* 🌤️ current weather區塊 */}
            <div className="current-weather">
              {weather ? (
                <>
                  <h1 className='cityName'>{weather.name}</h1>
                  <h2> {weather.main.temp}°</h2>
                  <HeaderWithTime />
                </>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* 🔮 未來預報區塊 */}
            <div className="forecast">
              {forecast.length > 0 ? (
                forecast.map((day, index) => {
                  const date = new Date(day.dt * 1000);
                  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
                  const icon = day.weather[0].icon;
                  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
                  const temp = Math.round(day.temp.day);

                  return (
                    <div key={index} className="forecast-item">
                      {weekday}<br />
                      <img src={iconUrl} alt="icon" />
                      <div>{temp}°C</div>
                    </div>
                  );
                })
              ) : (
                <p>Loading forecast...</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default App
