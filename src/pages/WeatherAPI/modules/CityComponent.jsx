import React from "react";
import { FaSearch } from "react-icons/fa";
const CityComponent = (props) => {
  const { updateCity, fetchWeather } = props;

  const searchBoxStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "20px",
   
    width: "100%",
    // height:'30vh'
  };

  const inputStyle = {
    width: "20vw",
    height: "2.5vw",
    border: "0",
    outline: "0",
    borderRadius: "3vh",
    fontSize: "0.9vw",
    paddingLeft: "1vw",
    display: "flex",
    alignItems: "center",
  };

  const buttonStyle = {
    backgroundColor: "black",
    fontSize: "0.9vw",
    padding: "0 10px",
    color: "white",
    border: "none",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.8vw",
    height: "2.7vw",
    borderRadius: "50%",
  };

  return (
    <>
      <img
        src={"/react-weather-app/icons/perfect-day.svg"}
        alt="Weather Logo"
        style={{ width: "140px", height: "140px", margin: "40px auto" }}
      />
      <span
        style={{
          color: "black",
          margin: "10px auto",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Find Weather of your city
      </span>
      <div style={searchBoxStyle}>
        <input
          onChange={(e) => updateCity(e.target.value)}
          placeholder="City"
          style={inputStyle}
        />
       <button onClick={fetchWeather} style={{ margin:'0',width: "1.2vw" ,cursor:'pointer',color:'black',backgroundColor:'white',width:'6vh',height:'6vh',fontSize:'2vh',borderRadius:'50%',padding:'1vh'}}>
          <FaSearch  />
          </button>
      </div>
    </>
  );
};

export default CityComponent;
