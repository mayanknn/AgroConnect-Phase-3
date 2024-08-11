import React, { useState } from 'react';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
import { app } from '../../../../firebase';
// import '../../Vendor.css'
import './upload.css'

import Raw from '../../../../assets/raw.jpg'
const db = getFirestore(app);
const imgdb = getStorage(app); // Initialize storage

function Upload() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState();
  const [expiryDate, setExpiryDate] = useState('');
  const [orders, setOrders] = useState();
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadThumbnail, setUploadThumbnail] = useState(); // Image file state
  const [description, setDescription] = useState(''); // Initialize description
  const [price, setPrice] = useState(); // Initialize price

  const uploadFile = async (file, path) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(imgdb, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const add = async () => {
    function randomAlphaNumeric(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const id = randomAlphaNumeric(10);
    console.log('Generated ID:', id);

    const vendorref = collection(db, "vendors");
    const vendordoc = doc(vendorref, id);

    try {
      if (uploadThumbnail) {
        const imageURL = await uploadFile(uploadThumbnail, `uploads/images/${Date.now()}-${uploadThumbnail.name}`);
        
        const localuser = localStorage.getItem('userData');
        const userData = JSON.parse(localuser);
        console.log(userData.uid);

        await setDoc(vendordoc, {
          vendorid: userData.uid,
          productid: id,
          product_name: name,
          product_desc: description,
          price: price,
          image: imageURL,
          category:category,
          expiryDate:expiryDate,
          quantity:quantity
        });
        alert('Added SuccessFully')
      } else {
        console.error('No file selected for upload');
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div style={{width:'100%',height:'90vh',display:'flex',justifyContent:'space-around',alignItems:'center',position:'absolute',top:'15vh'}}>
      <div>
        <h1>
          <table>
            <tbody>
              <tr>
                <td><label>Product Name : </label></td>
                <td>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td><label>Category : </label></td>
                <td>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="Rice">Rice Seeds</option>
                    <option value="Wheat">Wheat Seeds</option>
                    <option value="Cotton">Cotton Seeds</option>
                    <option value="Maize">Maize Seeds</option>
                    <option value="Maize">Pumpkin Seeds</option>
                    <option value="Fertilizers">Fertilizer</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td><label>Quantity [in Kg.]: </label></td>
                <td>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td><label>Expiry Date : </label></td>
                <td>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label>Description : </label></td>
                <td>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label>Price : </label></td>
                <td>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label>Upload Image : </label></td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadThumbnail(e.target.files[0])}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={add}>Upload</button>
        </h1>
      </div>
      
        <img src={Raw} alt="" style={{width:'35%'}}/>
      
    </div>
  );
}

export default Upload;
