import React, { useContext, useState } from 'react';
import './Login.css';
import loginSignUp from "../../assets/loginSignUp.mp4";
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { ShowProfileContext } from '../../context/ShowProfileContext';

const auth = getAuth(app);
const db = getFirestore(app);
const userRef = collection(db, 'users'); // Replace 'users' with your Firestore collection name

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signUpNormal,setSignUpNormal} = useContext(ShowProfileContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  function handleSignUp(){
    setSignUpNormal(false);
    navigate('/register');
  }
  const check = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful');
    //   navigate('/vendor'); // Redirect to /vendor on successful login

      const querySnapshot = await getDocs(query(userRef, where('Email', '==', email)));
      if (!querySnapshot.empty) {
        const queryData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(queryData));
        if(queryData.role === 'vendor'){
            navigate('/vendor');
        }
        else if(queryData.role === 'farmer'){
            navigate('/farmer');
        }
        else if(queryData.role === 'customer'){
            navigate('/customer');
        }
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert('Login Failed');
    }
  };

  return (
    <div className="login-wrapper">
      <video 
  src={loginSignUp} 
  autoPlay 
  muted 
  loop 
  className="background-video"
></video>
      <div className="login-container">
        <h1 className="login-title">Log In</h1>
        <div className="form-container">
          <table className="login-form" style={{background:'transparent'}}>
            <tbody>
              <tr>
                <td><label style={{color:'white'}}>Email</label></td>
                <td>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label style={{color:'white'}}>Password</label></td>
                <td>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <button className="submit-button" onClick={check}>Log In</button>
        <br />
        <h3 className="signup-link">Don't Have an Account? <a onClick={()=>handleSignUp()}>Sign Up</a></h3>
      </div>
    </div>
  );
}

export default LogIn;
