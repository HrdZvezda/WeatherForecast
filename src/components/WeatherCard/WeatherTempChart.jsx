import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area
} from "recharts";

/** 把 /forecast.list（3h 一筆）轉成指定日期 0~23 每分鐘資料
 *  - 溫度 temp：線性插值/雙點外插（回傳小數，畫面更平滑）
 *  - 降雨機率 pop：同樣插值/外插，輸出為 0~100（百分比）
 */
export function build24hSeries(list, dayTs) {
  if (!Array.isArray(list) || !dayTs) return [];
  const day = new Date(dayTs * 1000);
  const today = new Date();
  const isToday = (
    day.getFullYear() === today.getFullYear() &&
    day.getMonth() === today.getMonth() &&
    day.getDate() === today.getDate()
  );

  
  // 起始時間
  const start = isToday
    ? new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0, 0) // 今天：從現在小時開始
    : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);                     // 未來：從 00:00 開始

  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 0);

  // 取當日前後各 12 小時的資料，避免邊界外插太暴力
  const around = list
    .map(it => ({ ...it, d: new Date(it.dt * 1000) }))
    .filter(it => it.d >= new Date(start.getTime() - 36e5 * 12)
               && it.d <= new Date(start.getTime() + 36e5 * 36))
    .sort((a,b)=>a.d - b.d);

  // 泛用取值（key = "temp" | "pop"）
  const getValAt = (t, key) => {
    let prev = null, next = null;
    for (let i = 0; i < around.length; i++) {
      if (around[i].d <= t) prev = around[i];
      if (around[i].d >= t) { next = around[i]; break; }
    }
    const read = (row) => {
      if (key === "temp") return Number(row?.main?.temp ?? NaN);
      if (key === "pop")  return Number((row?.pop ?? 0)); // 0~1
      return NaN;
    };

    if (prev && next) {
      const t0 = prev.d.getTime(), t1 = next.d.getTime(), tt = t.getTime();
      const r = (tt - t0) / (t1 - t0 || 1);
      return read(prev) + (read(next) - read(prev)) * r;
    }
    if (!prev && next) {
      const i = around.findIndex(it => it === next);
      const p1 = around[i], p2 = around[i + 1];
      if (!p2) return read(p1);
      const t1 = p1.d.getTime(), t2 = p2.d.getTime(), tt = t.getTime();
      const slope = (read(p2) - read(p1)) / (t2 - t1 || 1);
      return read(p1) + slope * (tt - t1);
    }
    if (prev && !next) {
      const i = around.findIndex(it => it === prev);
      const p1 = around[i - 1], p2 = around[i];
      if (!p1) return read(p2);
      const t1 = p1.d.getTime(), t2 = p2.d.getTime(), tt = t.getTime();
      const slope = (read(p2) - read(p1)) / (t2 - t1 || 1);
      return read(p2) + slope * (tt - t2);
    }
    return NaN;
  };

  const STEP_MIN = 1;
  const out = [];
  for (let t = new Date(start); t <= end; t.setMinutes(t.getMinutes() + STEP_MIN)) {
    const temp = getValAt(t, "temp");
    const pop  = getValAt(t, "pop") * 100;
    if (Number.isFinite(temp) && Number.isFinite(pop)) {
      out.push({
        label: `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`,
        ts: t.getTime(),
        temp,
        tempBg: temp,
        pop
      });
    }
  }
  return out;
}


export default function WeatherTempChart({ forecast, dayTs, onClose }) {
  const list = Array.isArray(forecast?.list) ? forecast.list
              : Array.isArray(forecast) ? forecast : null;
  if (!list || !dayTs) return null;

  const data  = build24hSeries(list, dayTs);
  const temps = data.map(d => d.temp);

  const minTraw = Math.min(...temps);
  const maxTraw = Math.max(...temps);
  const minT = Math.round(minTraw);
  const maxT = Math.round(maxTraw);

  // 只在最高/最低溫顯示圓點
  const EPS = 1e-6;
  const minIdx = data.findIndex(d => Math.abs(d.temp - minTraw) < EPS);
  const maxIdx = data.findIndex(d => Math.abs(d.temp - maxTraw) < EPS);
  const ExtremumDot = ({ cx, cy, index }) => {
    if (index !== minIdx && index !== maxIdx) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={4.5} fill="#fefefe" />
        <circle cx={cx} cy={cy} r={5} stroke="#facc15bd" strokeWidth={2} fill="none" />
      </g>
    );
  };

  const dayDate = new Date(dayTs * 1000);
  const title = dayDate.toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric", weekday: "long"
  });

  // 自訂 Tooltip：只顯示 Temp(黃) 與 Rain(藍)，順序為 Temp 在上、Rain 在下
  const CustomTooltip = ({ active, label, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const tempItem = payload.find(p => p.dataKey === "temp");
    const rainItem = payload.find(p => p.dataKey === "pop");
    return (
      <div style={{
        background:"rgba(15,23,42,.95)",
        border:"1px solid rgba(255,255,255,.12)",
        borderRadius:12,
        padding:"8px 10px",
        color:"#e5e7eb",
        fontSize:12
      }}>
        <div style={{opacity:.85, marginBottom:4}}>{label}</div>
        {tempItem && <div style={{color:"#facc15"}}>Temp : {Math.round(tempItem.value)}°C</div>}
        {rainItem && <div style={{color:"#93c5fd"}}>Rain : {Math.round(rainItem.value)}%</div>}
      </div>
    );
  };

  // 產生 X 軸刻度：今天用剩餘小時決定，未來天固定 3 小時一格
  const firstTs = data?.[0]?.ts ? new Date(data[0].ts) : null;
  const now = new Date();
  const isToday =
    firstTs &&
    firstTs.getFullYear() === now.getFullYear() &&
    firstTs.getMonth() === now.getMonth() &&
    firstTs.getDate() === now.getDate();

    const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 500);
    useEffect(() => {
      const handler = () => {
        const narrow = window.innerWidth <= 500;
        setIsNarrow(prev => (prev !== narrow ? narrow : prev));
      };
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }, []);
  
    function makeTicksToday() {
      if (!firstTs) return [];
      if (isNarrow) {
        const ticks = [];
        let h = now.getHours();
        while (h <= 23) { ticks.push(`${String(h).padStart(2,"0")}:00`); h += 6; }
        return ticks;
      }
      const dayEnd = new Date(firstTs.getFullYear(), firstTs.getMonth(), firstTs.getDate(), 23, 59, 0);
      const remainingHours = Math.max(1, Math.ceil((dayEnd - now) / 36e5));
      const step = remainingHours <= 6 ? 1 : remainingHours <= 12 ? 3 : 6;
      const ticks = [];
      let h = now.getHours();
      while (h <= 23) { ticks.push(`${String(h).padStart(2,"0")}:00`); h += step; }
      return ticks;
    }
  
    function makeTicksOther() {
      const step = isNarrow ? 6 : 3;
      const ticks = [];
      for (let h = 0; h < 24; h += step) { ticks.push(`${String(h).padStart(2,"0")}:00`); }
      return ticks;
    }
  
    const hourTicks = isToday ? makeTicksToday() : makeTicksOther();

  return (
    <div className="sheet-mask" onClick={onClose}>
      <div className="sheet-body" onClick={(e)=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <h3 style={{color:"#e5e7eb", fontWeight:600, fontSize:16}}>{title}</h3>
          <button onClick={onClose} className="sheet-close">close</button>
        </div>
        <div style={{color:"#cbd5e1", fontSize:12, marginBottom:4}}>
          H : {maxT}°C  &nbsp; L : {minT}°C
        </div>

        <div style={{height:180}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0"/>
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                type="category"
                allowDuplicatedCategory={false}
                ticks={hourTicks}
                interval={0}
                tick={{ fill:"#cbd5e1", fontSize:12 }}
                tickMargin={8}
              />

              {/* 左軸：溫度 */}
              <YAxis
                yAxisId="left"
                domain={[Math.floor(minTraw) - 4, Math.ceil(maxTraw) + 3]}
                tick={{fill:"#cbd5e1", fontSize:12}}
                width={34}
              />
              {/* 右軸：降雨機率 0-100% */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{fill:"#93c5fd", fontSize:12}}
                width={34}
                tickFormatter={(v)=>`${v}%`}
              />

              {/* 自訂 Tooltip，移除灰色那筆，並調整順序 */}
              <Tooltip content={<CustomTooltip />} />

              {/* 溫度底色（跟線分開 dataKey，避免進入 Tooltip） */}
              <Area
                yAxisId="left"
                type="basis"
                dataKey="tempBg"
                stroke="none"
                fill="url(#tempFill)"
                isAnimationActive={false}
                activeDot={false}
              />

              {/* 溫度折線（只在極值顯示圓點） */}
              <Line
                yAxisId="left"
                type="basis"
                dataKey="temp"
                stroke="#facc15"
                strokeWidth={2}
                dot={<ExtremumDot />}
                activeDot={{ r:5 }}
                isAnimationActive={false}
              />

              {/* 降雨機率（藍色線） */}
              <Line
                yAxisId="right"
                type="monotoneX"
                dataKey="pop"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .sheet-mask{
          position:fixed;
          inset:0;
          display:flex;
          justify-content:center;
          align-items:flex-end;
          z-index:2000;
        }
        .sheet-body{
          width:min(720px,97%);
          margin-bottom:12px;
          background: rgb(55, 65, 81, .9);
          backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,200,.12);
          border-radius:12px;
          padding:16px;
        }
        .sheet-close{
          background:transparent;
          border:1px solid rgba(255,255,255,.2);
          color:#e5e7eb;
          border-radius:10px;
          padding:4px 10px;
          cursor:pointer
        }
        .sheet-close:hover{ background:rgba(255,255,255,.08) }

        .recharts-wrapper:focus,
        .recharts-surface:focus,
        .recharts-layer:focus,
        .recharts-dot:focus,
        .recharts-active-dot:focus,
        .recharts-line .recharts-dot:focus,
        circle:focus {
            outline: none !important;
        }

      `}</style>
    </div>
  );
}

