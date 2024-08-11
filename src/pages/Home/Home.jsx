import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import LogoImg from "../../assets/logo.png";
import Login from "../../assets/login.png";
import Video1 from "../../assets/Video1.mp4"; // Import the video
import ScrapeNews from "../ScrapeNews/ScrapeNews";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleNavigation = (role) => {
    navigate(`/register`, { state: { role } }); // Navigate to /register with role as state
  };

  useEffect(() => {
    const localuser = localStorage.getItem('userData');
    const userData = JSON.parse(localuser);

    if (userData !== null) {
      switch (userData.role) {
        case 'farmer':
          navigate('/farmer');
          break;
        case 'vendor':
          navigate('/vendor');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  return (
    <>
      <div className="home-video-container">
        <video src={Video1} autoPlay muted loop></video> {/* Set the video as background */}

        <nav className="nav-bar">
          <img src={LogoImg} alt="Logo" className="logo-img" />
          <button className="login-button" onClick={() => navigate('/login')}style={{marginRight:'2vw',display:'flex',justifyContent:'space-around'}}>
            Login
            <img src={Login} alt="Login Icon" className="login-icon" />
          </button>
        </nav>

        <div className="text-overlay">
          <h1 style={{color:'white' , fontWeight:'400',width:'50vw'}} >Your Partner in Agricultural Innovation</h1>
          <p>Empowering farmers, vendors, and customers with cutting-edge solutions.</p>
          <p>Join us today and be a part of the future of agriculture!</p>
        </div>

        <div className="button-container" style={{ bottom: '10vh' }}>
          <button 
            className="join-button farmer-button"
            onClick={() => handleNavigation('farmer')} // Navigate with role 'farmer'
          >
            Join As Farmer
          </button> 
          <button 
            className="join-button vendor-button"
            onClick={() => handleNavigation('vendor')} // Navigate with role 'vendor'
          >
            Join As Vendor
          </button> 
          <button 
            className="join-button customer-button"
            onClick={() => handleNavigation('customer')} // Navigate with role 'customer'
          >
            Join As Customer
          </button>
        </div> 
      </div>

      <ScrapeNews/>
    </>
  );
};

export default Home;
