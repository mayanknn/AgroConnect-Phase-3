// src/context/showProfile.jsx
import React, { useState, createContext } from 'react';

// Create a Context for the showWeather state
export const showWeatherData = createContext();

// Provider component to wrap the part of your app that needs access to showWeather state
export const ShowWeatherProvider = ({ children }) => {
    const [showWeather, setShowWeather] = useState('');
    const [showLocation, setShowLocation] = useState({ city: '', state: '' });

    return (
        <showWeatherData.Provider value={{ showWeather, setShowWeather, showLocation, setShowLocation }}>
            {children}
        </showWeatherData.Provider>
    );
};
