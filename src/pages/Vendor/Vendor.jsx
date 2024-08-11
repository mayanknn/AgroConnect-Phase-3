import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ShowProfileContext } from "../../context/ShowProfileContext";
import logo from "../../assets/logo.png";
import { FaTimes } from 'react-icons/fa'; // Import the close icon

import "./Vendor.css";
function Vendor() {
  const navigate = useNavigate();
  const { showProfile, setShowProfile } = useContext(ShowProfileContext);

  const localuser = localStorage.getItem("userData");
  const userData = JSON.parse(localuser);
  console.log(userData);

  function handleLogout() {
    // Common for every profile
    localStorage.removeItem("userData");
    setShowProfile(false);
    navigate("/");
  }
  const navButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    color: "#333",
    border: "2px solid #ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // padding: '10px 20px',
          boxShadow: "0 2px 5px green",
          marginBottom: "550px",
          padding: "2vh 3vw",
        }}
      >
        {/* Logo on the left */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "10vw", marginRight: "20px" }}
          />
        </div>

        {/* Navigation items on the right */}
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => navigate("news")} style={navButtonStyle}>
            News
          </button>
          <button
            onClick={() => navigate("/vendor/upload")}
            style={navButtonStyle}
          >
            Upload
          </button>
          <button
            onClick={() => navigate("/vendor/inventory")}
            style={navButtonStyle}
          >
            My Inventory
          </button>
          <button onClick={() => navigate("orders")} style={navButtonStyle}>
            My Orders
          </button>
          <button onClick={() => setShowProfile(true)} style={navButtonStyle}>
            Profile
          </button>
        </div>
      </nav>
      
      {showProfile && (
        <div
        style={{
          position: "fixed",
          top: "15vh",
          right: "5vw",
          backgroundColor: "lightcyan",
          border: "1px solid #ddd",
          borderRadius: "8px",
         
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: "1000",
          textAlign: "center", // Center-align content
         height:'60vh',
         width:'20vw',
         display:'flex',
         flexDirection:'column',
         alignItems:'center',
         gap:'2vh'
          
        }}
      >
        <button
          onClick={() => setShowProfile(false)}
          style={{
            background: "transparent",
            border: "none",
           
            
        
            transform: "translateX(-50%)", // Center the button horizontally
            cursor: "pointer",
            fontSize: "20px",
            color: "#f44336",
           
          }}
        >
          <FaTimes style={{position:'absolute',
        right:'0',
        top:'0'}} />
        </button>
        <div>
          <p>
            <img
              src={userData?.ProfileImage || "default-image-url"}
              alt="Profile"
              style={{
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                objectFit: "cover",
             
              }}
            />
          </p>
        </div>
        <div>
          
        <div style={{ marginBottom: "10px" }}>
          <p>
            <strong>Name:</strong> {userData?.Username || "N/A"}
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p>
            <strong>Email:</strong> {userData?.Email || "N/A"}
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p>
            <strong>Contact:</strong> {userData?.Phone || "N/A"}
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p>
            <strong>Role:</strong> {userData?.role || "N/A"}
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            width: "100%",
          }}
        >
          Log Out
        </button>
        </div>
      </div>
      )}

      <Outlet />
    </div>
  );
}

export default Vendor;
