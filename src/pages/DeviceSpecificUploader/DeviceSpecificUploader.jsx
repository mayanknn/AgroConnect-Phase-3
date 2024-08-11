import React, { useState, useRef, useEffect } from "react"; 
 
const DeviceSpecificUploader = () => { 
  const [isMobile, setIsMobile] = useState(false); 
  const videoRef = useRef(null); 
 
  useEffect(() => { 
    const checkDevice = () => { 
      const userAgent = navigator.userAgent.toLowerCase(); 
      if ( 
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test( 
          userAgent 
        ) 
      ) { 
        setIsMobile(true); 
      } else { 
        setIsMobile(false); 
      } 
    }; 
 
    checkDevice(); 
  }, []); 
 
  const handleImageChange = (event) => { 
    const file = event.target.files[0]; 
    if (file) { 
      const imageUrl = URL.createObjectURL(file); 
      console.log("Selected image URL: ", imageUrl); 
      // You can set the image in state if you need to display it 
    } 
  }; 
 
  const openLaptopCamera = async () => { 
    try { 
      const stream = await navigator.mediaDevices.getUserMedia({ video: true }); 
      videoRef.current.srcObject = stream; 
    } catch (err) { 
      console.error("Error accessing the camera: ", err); 
    } 
  }; 
 
  const stopLaptopCamera = () => { 
    const stream = videoRef.current.srcObject; 
    const tracks = stream.getTracks(); 
 
    tracks.forEach((track) => { 
      track.stop(); 
    }); 
 
    videoRef.current.srcObject = null; 
  }; 
 
  const triggerInput = (id) => { 
    document.getElementById(id).click(); 
  }; 
 
  return ( 
    <div> 
      <h2>Upload an Image</h2> 
      {isMobile ? ( 
        <> 
          {/* For mobile devices */} 
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
            id="cameraInput" 
          /> 
          <button onClick={() => triggerInput("cameraInput")} style={{ marginRight: "10px" }}> 
            Open Mobile Camera 
          </button> 
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
            id="galleryInput" 
          /> 
          <button onClick={() => triggerInput("galleryInput")}> 
            Open Mobile Gallery 
          </button> 
        </> 
      ) : ( 
        <> 
          {/* For laptop/desktop devices */} 
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
            id="fileInput" 
          /> 
          <button onClick={() => triggerInput("fileInput")} style={{ marginRight: "10px" }}> 
            Open Desktop File Picker 
          </button> 
          <button onClick={openLaptopCamera} style={{ marginRight: "10px" }}> 
            Open Laptop Camera 
          </button> 
          <button onClick={stopLaptopCamera}>Stop Camera</button> 
          <div style={{ marginTop: "20px" }}> 
            <video ref={videoRef} autoPlay style={{ width: "100%" }} /> 
          </div> 
        </> 
      )} 
    </div> 
  ); 
}; 
 
export default DeviceSpecificUploader;