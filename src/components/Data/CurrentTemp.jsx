import { useEffect, useState } from 'react';

const useCurrentTemp = (city, apiKey) => {
  const [temp, setTemp] = useState(null);

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (res.ok) setTemp(data.main.temp);
      } catch (err) {
        console.error("取得即時溫度失敗", err);
      }
    };

    fetchTemp();
  }, [city, apiKey]);

  return temp;
};

export default useCurrentTemp;
