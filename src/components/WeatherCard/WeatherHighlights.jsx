import React, { useState, useRef, useMemo, useEffect } from 'react';
import { WeatherAPI } from '../Data/WeatherAPI';
import { Thermometer, Wind, CloudRain, Droplets, Sun, Eye, Gauge, BarChart3 } from 'lucide-react';

const WH_CSS = `
  .wh-card{
    border-radius:20px; 
    padding:20px; 
    min-height:200px; 
    min-width:150px;
    backdrop-filter:blur(10px); 
    border:1px solid rgba(255,255,255,.3);
    box-shadow:0 4px 16px rgba(0,0,0,.1); 
    transition:all .25s ease;
  }
  .wh-card.is-active{
    border-color: rgba(59,130,246,.5);
    box-shadow:0 8px 32px rgba(0,0,0,.2);
    transform: translateY(-2px);
  }
  .wh-grid{ display:grid; grid-template-rows:auto 1fr auto; height:100%; }
  .wh-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:5px; }
  .wh-title{ color:hsl(220, 9%, 70%); font-size:14px; font-weight:500; }
  .wh-mid{ display:flex; align-items:center; justify-content:center; gap:6px; line-height:1; }
  .wh-val{ font-size:28px; font-weight:700; color:hsl(220, 10%, 90%); }
  .wh-unit{ font-size:12px; color:hsl(220, 9%, 70%); }
  .wh-desc{ text-align:center; opacity:.65; padding-bottom:2px; font-size:12px; color:hsl(220, 9%, 70%); }
`;


//WeatherCardHooks
//FeelsLike
const useFeelsLike = (weather) => {
  return useMemo(() => {
    return weather?.main?.feels_like !== undefined
      ? Math.round(weather.main.feels_like)
      : null;
  }, [weather]);
};

//RainChance
const useRainChance = (query, API_KEY, weather, hourlyData) => {
  const [rainChance, setRainChance] = useState(null);

  useEffect(() => {
    if (Array.isArray(hourlyData) && hourlyData.length) {
      const pops = hourlyData.slice(0, 12).map(h => Number(h.pop) || 0);
      const maxPop = Math.max(...pops);
      setRainChance(Math.round(maxPop * 100));
      return;
    }

    async function getRainChance() {
      try {
        let result;
        if (typeof query === "string") {
          result = await WeatherAPI.fetchForecastByCity(query);
        } else {
          setRainChance(null);
          return;
        }
        
        if (result.success) {
          const pop = result.data?.list?.[0]?.pop;
          if (typeof pop === 'number') {
            setRainChance(Math.round(pop * 100));
          } else {
            setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
          }
        } else {
          setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
        }
      } catch {
        setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
      }
    }
    if (!hourlyData && query && API_KEY) {
      getRainChance();
    }
  }, [hourlyData, query, API_KEY, weather]);
  
  return rainChance;
};

//UV
const useUVIndex = (weather) => {
  return useMemo(() => {
    const estimateUV = (weather) => {
      if (!weather) return null;
      let uv = 8;
      const hour = new Date().getHours();
      if (hour < 6 || hour > 18) return 0;
      const main = weather.weather?.[0]?.main?.toLowerCase() || '';
      if (main.includes('cloud')) uv *= 0.5;
      if (main.includes('rain') || main.includes('drizzle')) uv *= 0.2;
      if (main.includes('thunderstorm')) uv *= 0.1;
      return Math.round(uv * 10) / 10;
    };
    const uv = estimateUV(weather);
    return uv !== null ? `${uv}` : null;
  }, [weather]);
};

//Wind
const useWindSpeed = (weather) => {
  return useMemo(() => {
    return weather?.wind?.speed !== undefined
      ? (weather.wind.speed * 3.6).toFixed(1)
      : null;
  }, [weather]);
};

// 美國 AQI 0–500 計算（用 OpenWeather Air Pollution API 的 components）
const useUSAQI = (weather, query) => {
  const [state, setState] = useState({ value: null, primary: null, components: null });

  // 轉單位：ug/m3 -> ppm/ppb（25°C, 1 atm）
  const MW = { O3: 48, NO2: 46.0055, SO2: 64.066, CO: 28.01 };
  const ugm3_to_ppm = (ugm3, mw) => (ugm3 * 24.45) / (mw * 1000);
  const ugm3_to_ppb = (ugm3, mw) => (ugm3 * 24.45) / mw;

  const trunc = (v, d = 0) => (v == null ? null : Math.floor(v * 10 ** d) / 10 ** d);

  // 斷點表（US EPA）
  const BP = {
    pm25: [
      [0.0,12.0,   0, 50], [12.1,35.4,  51,100], [35.5,55.4, 101,150],
      [55.5,150.4,151,200],[150.5,250.4,201,300],[250.5,350.4,301,400],
      [350.5,500.4,401,500],
    ],
    pm10: [
      [0,54,  0,50],[55,154, 51,100],[155,254,101,150],
      [255,354,151,200],[355,424,201,300],[425,504,301,400],[505,604,401,500],
    ],
    o3_8h_ppm: [
      [0.000,0.054,  0,50],[0.055,0.070, 51,100],[0.071,0.085,101,150],
      [0.086,0.105,151,200],[0.106,0.200,201,300],
    ],
    o3_1h_ppm: [
      [0.125,0.164,101,150],[0.165,0.204,151,200],[0.205,0.404,201,300],
      [0.405,0.504,301,400],[0.505,0.604,401,500],
    ],
    no2_1h_ppb: [
      [0,53,  0,50],[54,100, 51,100],[101,360,101,150],
      [361,649,151,200],[650,1249,201,300],[1250,1649,301,400],[1650,2049,401,500],
    ],
    so2_1h_ppb: [
      [0,35,  0,50],[36,75,  51,100],[76,185,101,150],
      [186,304,151,200],[305,604,201,300],[605,804,301,400],[805,1004,401,500],
    ],
    co_8h_ppm: [
      [0.0,4.4,  0,50],[4.5,9.4, 51,100],[9.5,12.4,101,150],
      [12.5,15.4,151,200],[15.5,30.4,201,300],[30.5,40.4,301,400],[40.5,50.4,401,500],
    ],
  };

  const piecewiseAQI = (C, table) => {
    if (C == null) return null;
    for (const [Cl, Ch, Il, Ih] of table) {
      if (C >= Cl && C <= Ch) return Math.round(((Ih - Il) / (Ch - Cl)) * (C - Cl) + Il);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      try {
        let lat, lon;
        if (weather?.coord) ({ lat, lon } = weather.coord);
        else if (query && typeof query !== 'string') ({ lat, lon } = query || {});
        if (lat == null || lon == null) {
          setState({ value: null, primary: null, components: null });
          return;
        }

        const res = await WeatherAPI.fetchAirQualityByCoords(lat, lon);
        if (!res?.success) {
          setState({ value: null, primary: null, components: null });
          return;
        }

        const comp = res.data?.list?.[0]?.components || {};
        // 濃度截尾到規範精度
        const c_pm25 = trunc(comp.pm2_5, 1);
        const c_pm10 = Math.floor(comp.pm10 ?? 0);
        const c_o3_ppm  = trunc(ugm3_to_ppm(comp.o3 ?? 0,  MW.O3), 3);
        const c_no2_ppb = Math.floor(ugm3_to_ppb(comp.no2 ?? 0, MW.NO2));
        const c_so2_ppb = Math.floor(ugm3_to_ppb(comp.so2 ?? 0, MW.SO2));
        const c_co_ppm  = trunc(ugm3_to_ppm(comp.co ?? 0,  MW.CO), 1);

        // 各污染物 AQI
        const aqi_pm25 = piecewiseAQI(c_pm25, BP.pm25);
        const aqi_pm10 = piecewiseAQI(c_pm10, BP.pm10);
        const aqi_o3   = (c_o3_ppm <= 0.200)
          ? piecewiseAQI(c_o3_ppm, BP.o3_8h_ppm)
          : piecewiseAQI(c_o3_ppm, BP.o3_1h_ppm);
        const aqi_no2  = piecewiseAQI(c_no2_ppb, BP.no2_1h_ppb);
        const aqi_so2  = piecewiseAQI(c_so2_ppb, BP.so2_1h_ppb);
        const aqi_co   = piecewiseAQI(c_co_ppm,  BP.co_8h_ppm);

        const entries = [
          ['PM2.5', aqi_pm25], ['PM10', aqi_pm10], ['O3', aqi_o3],
          ['NO2', aqi_no2], ['SO2', aqi_so2], ['CO', aqi_co],
        ].filter(([, v]) => v != null);

        if (!entries.length) {
          setState({ value: null, primary: null, components: comp });
          return;
        }

        const [primary, value] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
        setState({ value, primary, components: comp });
      } catch {
        setState({ value: null, primary: null, components: null });
      }
    })();
  }, [weather?.coord?.lat, weather?.coord?.lon, query?.lat, query?.lon]);

  return state;
};


//Visibility
const useVisibility = (weather) => {
  return useMemo(() => {
    const visibility = weather?.visibility;
    return visibility !== undefined ? `${(visibility / 1000).toFixed(1)}` : null;
  }, [weather]);
};

//Pressure
const usePressure = (weather) => {
  return useMemo(() => {
    return weather?.main?.pressure !== undefined
      ? weather.main.pressure
      : null;
  }, [weather]);
};

//Humidity
const useHumidity = (weather) => {
  return useMemo(() => {
    return weather?.main?.humidity !== undefined
      ? weather.main.humidity
      : null;
  }, [weather]);
};

const WeatherCardSelector = ({ 
    forecastData = [],
    weather = null,
    query = null,
    API_KEY = null,
    hourlyData = null,
    initialDay = 0, 
    onDayChange = () => {},
    backgroundColor = 'transparent',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialDay); 
  // 使用所有的 hooks
  const rainChance = useRainChance(query, API_KEY, weather, hourlyData);
  const uvIndex = useUVIndex(weather);
  const visibility = useVisibility(weather);
  const windSpeed = useWindSpeed(weather);
  const feelsLike = useFeelsLike(weather);
  const pressure = usePressure(weather);
  const humidity = useHumidity(weather);
  const usaAqi = useUSAQI(weather, query);
  
  const handleCardHover = (index) => {
    if (selectedIndex !== index) {
      setSelectedIndex(index);
      onDayChange(forecastData[index], index); // 不想在 hover 就觸發，可刪這行
    }
  };

  // 動態描述工具
  const toNum = (v) => (v === null || v === undefined || v === '--' ? null : Number(v));
  const desc = {
    feelsLike(t) {
      if (t == null) return null;
      if (t >= 33) return 'Scorching';
      if (t >= 27) return 'Muggy';
      if (t >= 20) return 'Comfortable';
      if (t >= 10) return 'Cool';
      return 'Cold';
    },
    wind(kmh) {
      if (kmh == null) return null;
      if (kmh < 1) return 'Calm';
      if (kmh < 12) return 'Light breeze';
      if (kmh < 29) return 'Gentle breeze';
      if (kmh < 50) return 'Strong wind';
      return 'Gale';
    },
    humidity(pct) {
      if (pct == null) return null;
      if (pct < 30) return 'Dry';
      if (pct <= 60) return 'Comfortable';
      if (pct <= 80) return 'Elevated';
      return 'Humid';
    },
    visibility(km) {
      if (km == null) return null;
      if (km >= 10) return 'Good';
      if (km >= 5) return 'Fair';
      if (km >= 1) return 'Poor';
      return 'Very poor';
    },
    pressure(hpa) {
      if (hpa == null) return null;
      if (hpa < 1000) return 'Low';
      if (hpa <= 1025) return 'Normal';
      return 'High';
    },
    uv(uv) {
      if (uv == null) return null;
      if (uv <= 2) return 'Low';
      if (uv <= 5) return 'Moderate';
      if (uv <= 7) return 'High';
      if (uv <= 10) return 'Very high';
      return 'Extreme';
    },
    rain(pct) {
      if (pct == null) return null;
      if (pct >= 70) return 'Very likely';
      if (pct >= 40) return 'Likely';
      if (pct >= 20) return 'Possible';
      return 'Unlikely';
    },
    aqi(aqi) {
      if (aqi == null) return null;
      if (aqi <= 50) return 'Good';
      if (aqi <= 100) return 'Moderate';
      if (aqi <= 150) return 'Unhealthy for sensitive groups';
      if (aqi <= 200) return 'Unhealthy';
      if (aqi <= 300) return 'Very unhealthy';
      return 'Hazardous';
    },
  };

  const getWeatherData = () => {
    const windKmh = toNum(windSpeed);
    const visKm   = toNum(visibility);
    const uv      = toNum(uvIndex);
    const rain    = toNum(rainChance);
    const hum     = toNum(humidity);
    const feel    = toNum(feelsLike);
    const pres    = toNum(pressure);
    const aqi     = toNum(usaAqi.value);
  
    return [
      {
        title: "RainChance",
        value: rainChance || "--",
        unit: "%",
        description: desc.rain(rain),
        icon: <CloudRain className="w-6 h-6" color="#074fe9" />
      },
      {
        title: "FeelsLike",
        value: feelsLike || "--",
        unit: "°C",
        description: desc.feelsLike(feel),
        icon: <Thermometer className="w-6 h-6" color="#f97316"/>
      },
      {
        title: "UV",
        value: uvIndex || "--",
        unit: "",
        description: desc.uv(uv),
        icon: <Sun className="w-6 h-6" color="#eab308" />
      },
      {
        title: "AirQuality",
        value: usaAqi.value ?? "--", 
        description: desc.aqi(aqi),   
        icon: <BarChart3 className="w-6 h-6" color="#16a34a" />
      },      
      {
        title: "WindSpeed",
        value: windSpeed || "--",
        unit: " km/h",
        description: desc.wind(windKmh),
        icon: <Wind className="w-6 h-6" color="#81aaec" />
      },
      {
        title: "Humidity",
        value: humidity || "--",
        unit: "%",
        description: desc.humidity(hum),
        icon: <Droplets className="w-6 h-6" color="#3e8ef0"  />
      },
      {
        title: "Visibility",
        value: visibility || "--",
        unit: " km",
        description: desc.visibility(visKm),
        icon: <Eye className="w-6 h-6" color="#6b7280" />
      },
      {
        title: "Pressure",
        value: pressure || "--",
        unit: " hPa",
        description: desc.pressure(pres),
        icon: <Gauge className="w-6 h-6" color="#a855f7" />
      },
    ];
  };
  
  
  return (
    <>
      <style>{WH_CSS}</style>
      <div style={{ 
        padding: '20px 30px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow:'0 10px 30px rgba(0,0,0,.15)',
        borderRadius: '16px',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'hsl(220, 9%, 80%)',
          marginBottom: '16px',
          textAlign: 'start'
        }}>Today's Highlights</h2>
        
        {/* 2x4 網格佈局 - 8個卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '20px',
          width: '100%',
        }}>
          {getWeatherData().map((item, index) => (
          <div
          key={index}
          onMouseEnter={() => handleCardHover(index)}
          tabIndex={0}
          className={`wh-card ${selectedIndex === index ? 'is-active' : ''}`}
          >
            <div className="wh-grid">
              {/* 頂部：標題 + icon */}
              <div className="wh-head">
                <span className="wh-title">{item.title}</span>
                {item.icon}
              </div>
          
              {/* 中間：value + unit 完全置中 */}
              <div className="wh-mid">
                <span className="wh-val">{item.value}</span>
                {item.unit && <span className="wh-unit">{String(item.unit).trim()}</span>}
              </div>
          
              {/* 底部：desc 置中且貼底（無值就空字串保持高度一致） */}
              <div className="wh-desc">{item.description ?? ''}</div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherCardSelector;