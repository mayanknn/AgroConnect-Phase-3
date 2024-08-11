import React, { useState } from "react";
import Axios from "axios";
import WeatherComponent from "./modules/WeatherComponent";
import CityComponent from "./modules/CityComponent";

import sunny from '../../assets/sunny.jpg';
import cloudy from '../../assets/cloudy.jpg';
import nightsky from '../../assets/nightsky.jpg';
import rain from '../../assets/rain.png';
import rainy from '../../assets/rainy.jpg';
import thunder from '../../assets/thunder.jpg';
import snowy from '../../assets/snowy.jpg';
import fogg from '../../assets/fogg.png';

export const WeatherIcons = {
  "01d": sunny,
  "01n": nightsky,
  "02d": cloudy,
  "02n": cloudy,
  "03d": cloudy,
  "03n": cloudy,
  "04d": cloudy,
  "04n": cloudy,
  "09d": rain,
  "09n": rainy,
  "10d": rain,
  "10n": rainy,
  "11d": thunder,
  "11n": thunder,
  "13d": snowy,
  "13n": snowy,
  "50d": fogg,
  "50n": fogg,
};

function WeatherAPI() {
  const [city, updateCity] = useState();
  const [weather, updateWeather] = useState();

  const fetchWeather = async (e) => {
    e.preventDefault();
    const response = await Axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fe4feefa8543e06d4f3c66d92c61b69c`,
    );
    updateWeather(response.data);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    height: '80vh',
    margin: '10vh auto',
    borderRadius: '1vw',
    backgroundImage: 'linear-gradient(135deg,#00feba,#5b548a)',
    color: '#fff',
    textAlign: 'center',
    padding: '3vw',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif',
  };

  return (
    <div style={containerStyle}>
      
      {city && weather ? (
        <WeatherComponent weather={weather} city={city} />
      ) : (
        <CityComponent updateCity={updateCity} fetchWeather={fetchWeather} />
      )}
    </div>
  );
}

export default WeatherAPI;
