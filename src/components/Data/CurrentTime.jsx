import React from "react";
import { useEffect, useState } from "react";

const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
};

const HeaderWithTime = ({ className = '' , style = {} , showDate = true }) => {
  const time = useCurrentTime();
  
  // 分開取 hour:minute 與 AM/PM
  const hourMinute = time.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/ (AM|PM)$/, '');

  const meridiem = time.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).match(/AM|PM/)[0];
  // 獲取月份和日期
  const month = time.toLocaleDateString("en", {
    month: "short", // Jan, Feb, Mar...
  });
  const day = time.getDate();
  
  const dateString = ` ${day} ${month}`;

  // 獲取星期幾（英文）
  const weekday = time.toLocaleDateString("en", {
    weekday: "short"
  });

  return (
    <div className={`time ${ className } `} style = {style}>
      <h4>
        <span className="big">{hourMinute}</span>
        <span className="small"> {meridiem}</span>
        </h4>
        {showDate && (
          <div className="date-info">
            <span className="date">{day} {month} </span>
          </div>
        )}

      <style jsx>{`
        .nav-time {
            display:flex;
            align-items: baseline;
        }
        .nav-time h4 {
            color:#fff;
            margin: 0;
            font-weight: 400;
        }
        .nav-time h4 .big {
            font-size: 20px;
        }
        .nav-time h4 .small {
            font-size: 12px;
            vertical-align: super;
        }

        .time {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
        }
        .date-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
        .date {
          font-size: 18px;
          color: #fff
          font-weight: 400;
          line-height: 1;
        }
        
      `}</style>
    </div>
  );
};

export default HeaderWithTime;
