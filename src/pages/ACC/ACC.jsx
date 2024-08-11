import React, { useState } from 'react';
import './ACC.css';
import earth from '../../assets/planetearthbackground.jpg';
import CreditCard from './CreditCard';
import { app } from '../../firebase';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

const db = getFirestore(app);
const storage = getStorage(app);

const ACC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [incomeRange, setIncomeRange] = useState(10000); // Default value
  const [landHolding, setLandHolding] = useState('');
  const [salesBills, setSalesBills] = useState(null);
  const [salesBillsUrl, setSalesBillsUrl] = useState('');

  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const handleRangeChange = (event) => {
    setIncomeRange(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `salesBills/${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log('File uploaded successfully:', snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          setSalesBillsUrl(url);
          setSalesBills(file); // Keep a reference to the file (optional)
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await addDoc(collection(db, 'ACC'), {
        name: userData.Username,
        email: userData.Email,
        phone: userData.Phone,
        landHolding: landHolding,
        salesBills: salesBillsUrl, // URL to the uploaded PDF
        incomeRange: incomeRange
      });
      alert('Application submitted successfully!');
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error submitting application: ", error);
      alert('Error submitting application.');
    }
  };

  return (
    <div>
      <div className="hero-section" style={{ backgroundImage: `url(${earth})` }}>
        <h1>Introducing Agro Credit Card</h1>
        <button className="cta-button" onClick={() => setIsPopupOpen(true)}>Apply Now</button>
      </div>

      <CreditCard />

      <div className="feature-section">
        {/* Your feature sections here */}
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Application Form</h3>
            <div className="personal-details" style={{ margin: '4vh 0', fontSize: '1.5rem' }}>
              <p><strong>Name:</strong> {userData.Username}</p>
              <p><strong>Email:</strong> {userData.Email}</p>
              <p><strong>Phone:</strong> {userData.Phone}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="land-holding">Land Holding (in acres)</label>
                <input 
                  id="land-holding" 
                  type="text" 
                  placeholder="Land Holding (in acres)" 
                  value={landHolding}
                  onChange={(e) => setLandHolding(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="sales-bills">Sales/Bills (proof as PDF)</label>
                <input 
                  id="sales-bills" 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="income-range">Income Range</label>
                <input 
                  id="income-range" 
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="1000" 
                  value={incomeRange}
                  onChange={handleRangeChange}
                  required 
                />
                <span className="range-value">Rs.{incomeRange}</span>
              </div>
              <button type="submit" className="submit-button">Submit Application</button>
              <button type="button" className="close-button" onClick={() => setIsPopupOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ACC;
