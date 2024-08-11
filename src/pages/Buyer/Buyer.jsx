import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ShowProfileContext } from "../../context/ShowProfileContext";
import { FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.png";
function Buyer() {
  const navigate = useNavigate();
  const { showProfile, setShowProfile } = useContext(ShowProfileContext);

  const localuser = localStorage.getItem("userData");
  const userData = JSON.parse(localuser);

  function handleLogout() {
    localStorage.removeItem("userData");
    setShowProfile(false);
    navigate("/");
  }

  return (
    <div>
      <nav
        className="navF"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 5px green",
          // padding: '2vh 3vw',
          backgroundColor: "#fff",
        }}
      >
        <img src={logo} alt="" style={{ width: "10vw",paddingLeft:'2vw' }} />
        <div
          style={{
            display: "flex",
            gap: "3vw",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <button
            onClick={() => {
              navigate("homebuyer");
            }}
            style={{margin:'0'}}
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("news");
            }}
            style={{margin:'0'}}
          >
            News
          </button>
          <button onClick={() => navigate("cart")}  style={{margin:'0',width:'20vw'}} >Ordered Items</button>
          <button onClick={() => setShowProfile(true)}  style={{margin:'0'}}>Profile</button>{" "}
          {/* Corrected this line */}
         <input type="text" placeholder="Search"/>
        </div>
      </nav>

      {/* Profile */}
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
      {/* Profile */}
      <Outlet />
    </div>
  );
}

export default Buyer;
