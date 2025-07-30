import { useMemo } from 'react';

export default function useWindSpeed(weather) {
  return useMemo(() => {
    return weather?.wind?.speed !== undefined
      ? (weather.wind.speed * 3.6).toFixed(1) // m/s to km/h
      : null;
  }, [weather]);
}
