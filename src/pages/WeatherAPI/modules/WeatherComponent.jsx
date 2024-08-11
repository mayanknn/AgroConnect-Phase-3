import React from "react";
import { WeatherIcons } from "../WeatherAPI";
import { WiStrongWind, WiThermometer, WiSunrise, WiSunset } from "react-icons/wi";
import { FaWeight } from "react-icons/fa";

export const WeatherInfoIcons = {
  sunset: <WiSunset size={36} />,
  sunrise: <WiSunrise size={36} />,
  humidity: <WiThermometer size={36} />,
  wind: <WiStrongWind size={36} />,
  pressure: <FaWeight size={36} />,
};

const WeatherComponent = (props) => {
  const { weather } = props;
  const isDay = weather?.weather[0].icon?.includes("d");
  const getTime = (timeStamp) => {
    const date = new Date(timeStamp * 1000);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const weatherContainerStyle = {
    display: 'flex',
    width: '100%',
    margin: '30px auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const conditionStyle = {
    margin: '20px auto',
    fontSize: '14px',
    textTransform: 'capitalize',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const locationStyle = {
    margin: '15px auto',
    textTransform: 'capitalize',
    fontSize: '28px',
    fontWeight: 'bold',
  };

  const weatherIconStyle = {
    width: '16vw',
    height: '16vw',
    margin: '-1vw auto',
  };

  return (
    <>
      <div style={weatherContainerStyle}>
        <span style={conditionStyle}>
          <span style={{ fontSize: '4vw', fontWeight: '300' }}>{`${Math.floor(weather?.main?.temp - 273)}°C`}</span>
          {` | ${weather?.weather[0]?.description}`}
        </span>
        <img src={WeatherIcons[weather?.weather[0]?.icon]} alt="Weather Icon" style={weatherIconStyle} />
      </div>
      <span style={locationStyle}>{`${weather?.name}, ${weather?.sys?.country}`}</span>

      <span style={{ margin: '20px 25px 10px', fontWeight: 'bold', fontSize: '14px', textTransform: 'capitalize', width: '93%', textAlign: 'start' }}>
        Weather Info
      </span>

      <div style={{ display: 'flex', width: '93%', justifyContent: 'space-between', alignItems: 'center', margin: '2vw auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {WeatherInfoIcons[isDay ? "sunset" : "sunrise"]}
          <span style={{ fontSize: '14px', margin: '15px' }}>{getTime(weather?.sys[isDay ? "sunset" : "sunrise"])}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {WeatherInfoIcons.humidity}
          <span style={{ fontSize: '14px', margin: '15px' }}>{`${weather?.main?.humidity} %`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {WeatherInfoIcons.wind}
          <span style={{ fontSize: '14px', margin: '15px' }}>{`${weather?.wind?.speed} m/s`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {WeatherInfoIcons.pressure}
          <span style={{ fontSize: '14px', margin: '15px' }}>{`${weather?.main?.pressure} hPa`}</span>
        </div>
      </div>
    </>
  );
};

export default WeatherComponent;
