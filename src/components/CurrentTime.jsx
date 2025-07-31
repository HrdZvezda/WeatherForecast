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

const HeaderWithTime = ({ className = '' , style = {}}) => {
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

  
  return (
    <div className={`time ${ className } `} style = {style}>
      <h4>
        <span className="big">{hourMinute}</span>
        <span className="small"> {meridiem}</span>
        </h4>
    </div>
  );
};

export default HeaderWithTime;
