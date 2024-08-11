import React, { useState, useRef, useContext } from 'react'; 
import { useLocation, useNavigate } from "react-router-dom";
import { app } from '../../firebase';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getStorage, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Cropper from 'react-cropper'; 
import 'cropperjs/dist/cropper.css'; 
import './Register.css'; 
import loginSignUp from "../../assets/loginSignUp.mp4"; 
import { ShowProfileContext } from '../../context/ShowProfileContext';

const db = getFirestore(app);
const imgdb = getStorage(app);
const auth = getAuth(app);

const Register = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const { signUpNormal, setSignUpNormal } = useContext(ShowProfileContext);
  const { role: locationRole } = location.state || {}; 

  const cropperRef = useRef(null); 
  const [image, setImage] = useState(''); 
  const [croppedImage, setCroppedImage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Form field states 
  const [name, setName] = useState(''); 
  const [contact, setContact] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [role, setRole] = useState(locationRole || 'farmer'); 

  const add = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const { uid } = user;

      const imgRef = ref(imgdb, `uploads/images/${Date.now()}-${croppedImage.name}`);
      const uploadResult = await uploadBytes(imgRef, croppedImage, { contentType: 'image/jpeg' });      
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        uid,
        Email: email,
        Username: name,
        Phone: contact,
        Password: password,
        ProfileImage: downloadURL,
        role: role
      });
      navigate('/login');
    } catch (error) {
      console.error('Error creating user', error);
    }
  };
 
  const onCrop = () => { 
    const cropper = cropperRef.current.cropper; 
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      setCroppedImage(blob);
      setIsModalOpen(false);
    }, 'image/jpeg');
  };
  
  const onFileChange = (e) => { 
    const file = e.target.files[0]; 
    const reader = new FileReader(); 
    reader.onload = () => { 
      setImage(reader.result); 
      setIsModalOpen(true); 
    }; 
    reader.readAsDataURL(file); 
  }; 
 
  return ( 
    <div className="register-wrapper">
      <video src={loginSignUp} autoPlay muted loop className="background-video"></video>
      <div className="register-container"> 
        <h1 className="register-title">{!signUpNormal ? 'Register' : `Register as ${role}`}</h1> 
        <div className="form-container">
          <table className="register-form" style={{ background: 'transparent' }}>
            <tbody> 
              <tr> 
                <td><label style={{color:'white'}}>Name</label></td> 
                <td><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></td> 
              </tr> 
              <tr> 
                <td><label style={{color:'white'}}>Contact No.</label></td> 
                <td><input type="number" value={contact} onChange={(e) => setContact(e.target.value)} /></td> 
              </tr> 
              <tr> 
                <td><label style={{color:'white'}}>Email</label></td> 
                <td><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></td> 
              </tr> 
              <tr> 
                <td><label style={{color:'white'}}>Password</label></td> 
                <td><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></td> 
              </tr> 
              <tr> 
                <td><label style={{color:'white'}}>Confirm Password</label></td> 
                <td><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></td> 
              </tr> 
              {!signUpNormal && (
                <tr>
                  <td><label style={{color:'white'}}>Role</label></td>
                  <td>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="farmer">Farmer</option>
                      <option value="vendor">Vendor</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                </tr>
              )}
              <tr> 
                <td><label style={{color:'white'}}>Profile Image</label></td> 
                <td> 
                  <input type="file" accept="image/*" onChange={onFileChange} /> 
                  {croppedImage && ( 
                    <div className="image-preview" style={{width:'5vw',height:'5vw'}}> 
                      <img src={URL.createObjectURL(croppedImage)} style={{width:'100%',borderRadius:'100%'}} alt="Cropped"  /> 
                    </div> 
                  )} 
                </td> 
              </tr> 
            </tbody> 
          </table> 
          <br /> 
          <button onClick={add} className="submit-button">Sign Up</button> 
          <br /> 
          <h3 style={{color:'white'}}>Already Have an Account? <a style={{color:'white'}} href="/login" className="login-link">Log In</a></h3> 
        </div> 
 
        {isModalOpen && ( 
          <div className="modal"> 
            <div className="modal-content" style={{height:'100vh',width:'50vw',overflow:'scroll'}}> 
              <Cropper 
                src={image} 
                aspectRatio={1} 
                guides={false} 
                ref={cropperRef} 
              /> 
              <button onClick={onCrop} className="modal-button">Set Image</button> 
              <button onClick={() => setIsModalOpen(false)} className="modal-button cancel-button">Cancel</button> 
            </div> 
          </div> 
        )} 
      </div> 
    </div>
  ); 
} 

export default Register;
