import React from "react";
import './WeatherIcon.css';

const WeatherIcon = ({ type, size = "mid" }) => {
  const sizeClass = `icon-${size}`;

  const renderIcon = (weatherClass, children) => (
    <div className={`icon ${weatherClass} ${sizeClass}`}>
      {children}
    </div>
  );

  switch (type) {
    case 'Sun-shower':
      return renderIcon("sun-shower", <>
        <div className="cloud"></div>
        <div className="sun"><div className="rays"></div></div>
        <div className="rain"></div>
      </>);

    case 'Thunderstorm':
      return renderIcon("thunder-storm", <>
        <div className="cloud"></div>
        <div className="lightning">
          <div className="bolt"></div>
          <div className="bolt"></div>
        </div>
      </>);

    case 'Clouds':
      return renderIcon("cloudy", <>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </>);

    case 'Snow':
      return renderIcon("flurries", <>
        <div className="cloud"></div>
        <div className="snow">
          <div className="flake"></div>
          <div className="flake"></div>
        </div>
      </>);

    case 'Clear':
      return renderIcon("sunny", <>
        <div className="sun"><div className="rays"></div></div>
      </>);

    case 'Rain':
      return renderIcon("rainy", <>
        <div className="cloud"></div>
        <div className="rain"></div>
      </>);

    default:
      return null;
  }
};

export default WeatherIcon;