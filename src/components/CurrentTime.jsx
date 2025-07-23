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

const HeaderWithTime = ({ locationName }) => {
    const time = useCurrentTime();
  
    const formatTime = (date) =>
      date.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
      });
  
    return (
      <div className="time">
        <h4>{formatTime(time)}</h4>
      </div>
    );
  };

export default HeaderWithTime;
