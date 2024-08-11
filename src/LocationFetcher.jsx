import React, { useState, useEffect, useContext } from "react";
import { showWeatherData } from "./context/WeatherLocation";
const LocationFetcher = () => {
  const {location, setLocation} = useContext(showWeatherData)
  const [error, setError] = useState(null);
  const {weather, setWeather} = useContext(showWeatherData)
  const fetchWeather = async (latitude, longitude) => {
    const apiKey = "7aaf6f95c06d42a1aef220103240908"; // Replace with your WeatherAPI key        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError("Failed to fetch weather data.");
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  return (
    <div>
      {" "}
      {error ? (
        <p>Error: {error}</p>
      ) : location.latitude && location.longitude ? (
        <>
          {" "}
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}{" "}
          </p>
          {weather ? (
            <div>
              <h3>Weather Information</h3>{" "}
              <p>Temperature: {weather.current.temp_c} °C</p>
              <p>Weather: {weather.current.condition.text}</p>{" "}
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind Speed: {weather.current.wind_kph} kph</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}{" "}
        </>
      ) : (
        <p>Fetching location...</p>
      )}{" "}
    </div>
  );
};
export default LocationFetcher;
