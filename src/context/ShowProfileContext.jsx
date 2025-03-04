// src/context/showProfile.jsx
import React, { useState, createContext } from 'react';

// Create a Context for the showProfile state
export const ShowProfileContext = createContext();

// Provider component to wrap the part of your app that needs access to showProfile state
export const ShowProfileProvider = ({ children }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [signUpNormal,setSignUpNormal] = useState(true);
    // const [showUploadForm, setShowUploadForm] = useState(false);
    
    return (
        <ShowProfileContext.Provider value={{ showProfile, setShowProfile,signUpNormal,setSignUpNormal}}>
            {children}
        </ShowProfileContext.Provider>
    );
};