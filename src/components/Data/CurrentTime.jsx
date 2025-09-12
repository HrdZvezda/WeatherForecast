import React from "react";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nContext";

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
  const { formatDateTime, currentLanguage } = useI18n();

  
  // 分開取 hour:minute 與 AM/PM
  const hourMinute = formatDateTime(time,{
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/ (AM|PM)$/, '').replace(/上午|下午/, '');

  const meridiem = formatDateTime(time, {
    hour: 'numeric',
    hour12: true
  }).split(' ')[1] || '';

  // 獲取月份和日期
  const month = formatDateTime(time, { month: "short" });
  const day = time.getDate();
  
  const dateString = currentLanguage === 'zh' 
  ? `${month}${day}日` 
  : `${day} ${month}`;

  // 獲取星期幾（英文）
  const weekday = time.toLocaleDateString("en", {
    weekday: "short"
  });

  return (
    <div className={`time ${ className } `} style = {style}>
      <div>
        <h4>
          {/* 中文時，將上下午放在前面 */}
          {currentLanguage === 'zh' && <span className="small">{meridiem} </span>}
          <span className="big">{hourMinute}</span>
          {/* 英文時，將 AM/PM 放在後面 */}
          {currentLanguage !== 'zh' && <span className="small"> {meridiem}</span>}
        </h4>
      </div>
      {showDate && (
        <div className="date-info">
          <span className="date">{dateString}</span>
        </div>
      )}

      <style jsx>{`
        .nav-time {
            display:flex;
            align-items: baseline;
            font-weight: 450;
            color:#fff;
            margin: 0;
            padding: 2px 0;
        }
        .nav-time h4 .big {
            font-size: 18px;
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
        .main-time{
          display:none;
        }
        @media (max-width: 760px) {
          .nav-time{
              display: none;
          }
          .main-time{
            display: flex;
            color:hsl(220, 9%, 80%); 
          }
          .time h4 .big {
            font-size: 18px;
          }
          .time h4 .small {
            font-size: 12px;
          }
          .date{
            font-size: 16px;
          }
        }

        @media (max-width: 630px) {
          .nav-time h4 .big {
            font-size: 16px;
          }
          .nav-time h4 .small {
              font-size: 10px;
          }
          .date{
            font-size: 16px;
          }
        }

         
        @media (max-width: 350px) {
          .time{
            display: block;
            line-height: 1.8;
          }
          .time h4 .big {
            font-size: 16px;
          }
          .time h4 .small {
              font-size: 8px;
          }
          .date{
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderWithTime;
