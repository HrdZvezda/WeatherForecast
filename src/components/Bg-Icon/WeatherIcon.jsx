// WeatherIcon.jsx
import React from "react";

const SIZE_MAP = { xs: 24, sm: 42, mid: 78, lg: 96,  };

function mapTypeToOwm(type, isNight = false) {
  const d = isNight ? "n" : "d";
  switch (type) {
    case "Clear":        return `01${d}`;
    case "Clouds":       return `03${d}`;
    case "Rain":         return `10${d}`;
    case "Sun-shower":   return `09${d}`;
    case "Thunderstorm": return `11${d}`;
    case "Snow":         return `13${d}`;
    default:             return `03${d}`;
  }
}

export default function WeatherIcon({
  code,                 // 建議直接傳 OWM 的 icon 代碼，如 "10d"
  type,                 // 舊參數：仍可用（會映射到日間代碼）
  size = "mid",         // 'xs' | 'sm' | 'mid' | 'lg' | number(px)
  alt = "",
  className = "",
  style = {},           // 套在「外層槽位」上
}) {
  const px = typeof size === "number" ? size : (SIZE_MAP[size] || 64);
  const scale = px >= 128 ? "@4x" : px >= 64 ? "@2x" : "";
  const finalCode = code || mapTypeToOwm(type);
  if (!finalCode) return null;

  const src = `https://openweathermap.org/img/wn/${finalCode}${scale}.png`;

  const slotStyle = {
    inlineSize: px,         // 固定寬度（writing-mode 無關）
    blockSize: px,          // 固定高度
    flex: `0 0 ${px}px`,    // 在 flex 容器內佔用固定寬度
    display: "inline-block",
    lineHeight: 0,          // 消除行內空隙
    ...style,
  };

  const [imgSrc, setImgSrc] = React.useState(src);
  React.useEffect(() => setImgSrc(src), [src]);

  
  return (
    <span className={className} style={slotStyle}>
      <img
        src={imgSrc}
        alt={alt || type || finalCode}
        width={px}
        height={px}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{
          display: "block",      // 不參與文字基線排版
          inlineSize: "100%",
          blockSize: "100%",
          objectFit: "contain",  // 以比例縮放，完全包在槽位內
        }}
        onError={() => {
          // 退回 1x，避免 2x/4x 丟失時造成 reflow
          if (imgSrc.includes("@")) {
            setImgSrc(`https://openweathermap.org/img/wn/${finalCode}.png`);
          }
        }}
      />
    </span>
  );
}
