import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { showWeatherData } from '../../context/WeatherLocation'; // Ensure correct path to context

function AI() {
    const { showWeather, setShowWeather, showLocation, setShowLocation } = useContext(showWeatherData);
    const [currentTime, setCurrentTime] = useState('');
    const [soilType, setSoilType] = useState('');
    const [currentCrops, setCurrentCrops] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch location and weather data on component mount
    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        // Reverse geocode to get city and state
                        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
                        try {
                            const response = await fetch(geocodeUrl);
                            const data = await response.json();
                            const city = data.address.city || '';
                            const state = data.address.state || '';
                            setShowLocation({ city, state });

                            // Fetch weather data
                            const apiKey = "7aaf6f95c06d42a1aef220103240908";
                            const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
                            const weatherResponse = await fetch(weatherUrl);
                            const weatherData = await weatherResponse.json();

                            // Format weather data for input
                            const formattedWeather = `Temperature: ${weatherData.current.temp_c} °C, Weather: ${weatherData.current.condition.text}, Humidity: ${weatherData.current.humidity}%, Wind Speed: ${weatherData.current.wind_kph} kph`;
                            setShowWeather(formattedWeather);
                        } catch (error) {
                            setError("Failed to fetch data.");
                        }
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }

            // Set current time and month
            const now = new Date();
            const month = now.toLocaleString('default', { month: 'long' });
            const time = now.toLocaleTimeString();
            setCurrentTime(`${month} ${time}`);
        };

        fetchLocationAndWeather();
    }, [setShowWeather, setShowLocation]);

    const handleButtonClick = async () => {
        setIsLoading(true);

        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCn3A8z6z1jIQn-JWoEoXQkw0Mgm8GRojw",
                method: "post",
                data: {
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": `Based on the following details, what crop should be produced (give only name of the crop (1 or 2) that can be grown in following conditions i have given to you) ? Weather: ${showWeather}, Location: ${showLocation.city}, ${showLocation.state}, Current Time/Month: ${currentTime}, Soil Type: ${soilType}, Current Crops: ${currentCrops}.`
                                }
                            ]
                        }
                    ]
                }
            });

            setRecommendation(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error fetching the recommendation", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <h2>Crop Recommendation</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Enter Weather"
                value={showWeather}
                onChange={(e) => setShowWeather(e.target.value)}
                className="ai-input"
            />
            <input
                type="text"
                placeholder="Enter Location"
                value={`${showLocation.city}, ${showLocation.state}`}
                readOnly
                className="ai-input"
            />
            <input
                type="text"
                placeholder="Enter Current Time/Month"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                className="ai-input"
            />
            <input
                type="text"
                placeholder="Enter Soil Type"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="ai-input"
            />
            <input
                type="text"
                placeholder="Enter Current Crops"
                value={currentCrops}
                onChange={(e) => setCurrentCrops(e.target.value)}
                className="ai-input"
            />
            <button onClick={handleButtonClick} disabled={isLoading}>
                Get Recommendation
            </button>
            {isLoading ? (
                <div className="ai-loading">Loading...</div>
            ) : (
                <div className="ai-recommendation-box">
                    {recommendation.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AI;
