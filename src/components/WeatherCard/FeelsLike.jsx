import { useMemo } from 'react';

export default function useFeelsLike(weather) {
  return useMemo(() => {
    return weather?.main?.feels_like !== undefined
      ? Math.round(weather.main.feels_like)
      : null;
  }, [weather]);
}