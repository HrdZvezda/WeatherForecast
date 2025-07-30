import { useMemo } from 'react';

// UV邏輯可根據你的需求調整，這裡採用估算
function estimateUV(weather) {
  if (!weather) return null;
  // 基於現有天氣和時段 (簡易版)
  let uv = 8;
  const hour = new Date().getHours();
  if (hour < 6 || hour > 18) return 0;
  const main = weather.weather?.[0]?.main?.toLowerCase() || '';
  if (main.includes('cloud')) uv *= 0.5;
  if (main.includes('rain') || main.includes('drizzle')) uv *= 0.2;
  if (main.includes('thunderstorm')) uv *= 0.1;
  return Math.round(uv * 10) / 10;
}

function getUVLevel(uv) {
  if (uv === null) return "無資料";
  if (uv <= 2) return "低";
  if (uv <= 5) return "中等";
  if (uv <= 7) return "高";
  if (uv <= 10) return "極高";
  return "危險";
}

export default function useUVIndex(weather) {
  return useMemo(() => {
    const uv = estimateUV(weather);
    return uv !== null ? `${uv} (${getUVLevel(uv)})` : null;
  }, [weather]);
}
