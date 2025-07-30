import { useState, useEffect } from 'react';

// 傳入 query、API_KEY（和 weather 資料以便 fallback）
export default function useRainChance(query, API_KEY, weather) {
  const [rainChance, setRainChance] = useState(null);

  useEffect(() => {
    async function getRainChance() {
      try {
        let url = '';
        if (typeof query === "string") {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`;
        } else if (query.lat && query.lon) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=metric`;
        } else {
          setRainChance(null);
          return;
        }
        const res = await fetch(url);
        const data = await res.json();
        // FUTURE 3HR預報的pop欄位（0~1）
        const pop = data?.list?.[0]?.pop;
        if (typeof pop === 'number') {
          setRainChance(Math.round(pop * 100));
        } else {
          setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
        }
      } catch {
        setRainChance(weather ? Math.round((weather.clouds?.all || 0) / 2) : null);
      }
    }
    getRainChance();
    // eslint-disable-next-line
  }, [query, API_KEY, weather]);
  return rainChance;
}
