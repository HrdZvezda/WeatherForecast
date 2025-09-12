import React, { useState, useRef, useMemo, useEffect } from 'react';
import { WeatherAPI } from '../Data/WeatherAPI';
import { Thermometer, Wind, CloudRain, Droplets, Sun, Eye, Gauge, BarChart3 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';

const WH_CSS = `
  .wh-container {
    gap: 20px;
    padding: 24px 8px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    overflow-x: scroll;
    scrollbar-width: none;
  }
  .wh-card{
    border-radius:20px; 
    padding:20px; 
    height:200px; 
    width:150px;
    backdrop-filter:blur(10px); 
    border:1px solid rgba(255,255,255,.3);
    box-shadow:0 2px 8px rgba(0,0,0,.1); 
    transition:all .25s ease;
  }
  .wh-card.is-active{
    border-color: rgba(59,130,246,.5);
    box-shadow:0 4px 16px rgba(0,0,0,.2);
    transform: translateY(-2px);
  }
  .wh-grid{ 
    display:grid; 
    grid-template-rows:auto 1fr auto; 
    height:100%; 
  }
  .wh-head{ 
    display:flex; 
    align-items:center; 
    justify-content:space-between; 
    margin-bottom:8px; 
    gap:5px; 
  }
  .wh-title{ 
    color:hsl(220, 9%, 70%); 
    font-size:14px; 
    font-weight:500; 
  }
  .wh-mid{ 
    display:flex; 
    align-items:center; 
    justify-content:center; 
    gap:6px; 
    line-height:1; 
  }
  .wh-val{ 
    font-size:28px; 
    font-weight:700; 
    color:hsl(220, 10%, 90%); 
  }
  .wh-unit{ 
    font-size:14px; 
    color:hsl(220, 9%, 70%); 
  }
  .wh-desc{ 
    text-align:center; 
    opacity:.65; 
    padding-bottom:2px; 
    font-size:14px; 
    color:hsl(220, 9%, 70%); 
  }

  @media (max-width: 1500px) {
    .wh-card {
      height:200px; 
      min-width:100%;
    }
    .wh-title{
      font-size: 18px;
    }
    .wh-desc{
      font-size: 16px;  
    }
  }
  @media (max-width: 1200px) {
    .wh-card {
      height:190px; 
    }
    .wh-title{
      font-size: 16px;
    }
    .wh-desc{
      font-size: 14px;  
    }
  }
  @media (max-width: 900px) {
    .wh-title{
      font-size: 14px;
    }
    .wh-desc{
      font-size: 12px;  
    }
  }

  @media (max-width: 620px) {
    .wh-card {
      width:150px;
    }
  }
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
    setRainChance(null);

    if (Array.isArray(hourlyData) && hourlyData.length) {
      const pops = hourlyData.slice(0, 12).map(h => Number(h.pop) || 0);
      const maxPop = Math.max(...pops);
      setRainChance(Math.round(maxPop * 100));
      return;
    }
  }, [hourlyData, query]);

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
        // 濃度截尾到要範精度
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

const Weatherhighlights = ({ 
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
  const { t } = useI18n();

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
      onDayChange(forecastData[index], index);
    }
  };

  // 動態描述工具 - 使用翻譯系統
  const toNum = (v) => (v === null || v === undefined || v === '--' ? null : Number(v));
  const desc = {
    feelsLike(t) {
      if (t == null) return null;
      if (t >= 33) return 'scorching';
      if (t >= 27) return 'muggy';
      if (t >= 20) return 'comfortable';
      if (t >= 10) return 'cool';
      return 'cold';
    },
    wind(kmh) {
      if (kmh == null) return null;
      if (kmh < 1) return 'calm';
      if (kmh < 12) return 'light';
      if (kmh < 29) return 'gentle';
      if (kmh < 50) return 'strong';
      return 'gale';
    },
    humidity(pct) {
      if (pct == null) return null;
      if (pct < 30) return 'dry';
      if (pct <= 60) return 'comfortable';
      if (pct <= 80) return 'elevated';
      return 'humid';
    },
    visibility(km) {
      if (km == null) return null;
      if (km >= 10) return 'good';
      if (km >= 5) return 'fair';
      if (km >= 1) return 'poor';
      return 'veryPoor';
    },
    pressure(hpa) {
      if (hpa == null) return null;
      if (hpa < 1000) return 'low';
      if (hpa <= 1025) return 'normal';
      return 'high';
    },
    uv(uv) {
      if (uv == null) return null;
      if (uv === 0) return 'none';
      if (uv <= 2) return 'low';
      if (uv <= 5) return 'moderate';
      if (uv <= 7) return 'high';
      if (uv <= 10) return 'veryHigh';
      return 'extreme';
    },
    rain(pct) {
      if (pct == null) return null;
      if (pct >= 70) return 'veryLikely';
      if (pct >= 40) return 'likely';
      if (pct >= 20) return 'possible';
      return 'unlikely';
    },
    aqi(aqi) {
      if (aqi == null) return null;
      if (aqi <= 50) return 'good';
      if (aqi <= 100) return 'moderate';
      if (aqi <= 150) return 'ufsg';
      if (aqi <= 200) return 'unhealthy';
      if (aqi <= 300) return 'veryUnhealthy';
      return 'hazardous';
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
        title: t('highlights.rainChance'),
        value: rainChance || "--",
        unit: "%",
        description: desc.rain(rain) ? t(`desc.rain.${desc.rain(rain)}`) : null,
        icon: <CloudRain className="w-6 h-6" color="#074fe9" />
      },
      {
        title: t('highlights.feelsLike'),
        value: feelsLike || "--",
        unit: "°C",
        description: desc.feelsLike(feel) ? t(`desc.feelsLike.${desc.feelsLike(feel)}`) : null,
        icon: <Thermometer className="w-6 h-6" color="#f97316"/>
      },
      {
        title: t('highlights.uv'),
        value: uvIndex || "--",
        unit: "",
        description: desc.uv(uv) ? t(`desc.uv.${desc.uv(uv)}`) : null,
        icon: <Sun className="w-6 h-6" color="#eab308" />
      },
      {
        title: t('highlights.airQuality'),
        value: usaAqi.value ?? "--", 
        description: desc.aqi(aqi) ? t(`desc.aqi.${desc.aqi(aqi)}`) : null,   
        icon: <BarChart3 className="w-6 h-6" color="#16a34a" />
      },      
      {
        title: t('highlights.windSpeed'),
        value: windSpeed || "--",
        unit: " km/h",
        description: desc.wind(windKmh) ? t(`desc.wind.${desc.wind(windKmh)}`) : null,
        icon: <Wind className="w-6 h-6" color="#81aaec" />
      },
      {
        title: t('highlights.humidity'),
        value: humidity || "--",
        unit: "%",
        description: desc.humidity(hum) ? t(`desc.humidity.${desc.humidity(hum)}`) : null,
        icon: <Droplets className="w-6 h-6" color="#3e8ef0"  />
      },
      {
        title: t('highlights.visibility'),
        value: visibility || "--",
        unit: " km",
        description: desc.visibility(visKm) ? t(`desc.visibility.${desc.visibility(visKm)}`) : null,
        icon: <Eye className="w-6 h-6" color="#6b7280" />
      },
      {
        title: t('highlights.pressure'),
        value: pressure || "--",
        unit: " hPa",
        description: desc.pressure(pres) ? t(`desc.pressure.${desc.pressure(pres)}`) : null,
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
        }}>{t('highlights.title')}</h2>
        
        {/* 2x4 網格佈局 - 8個卡片 */}
        <div className='wh-container'>
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

export default Weatherhighlights;