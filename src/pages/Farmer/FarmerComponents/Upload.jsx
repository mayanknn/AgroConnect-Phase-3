import React, { useState } from 'react';  
import { IoClose } from "react-icons/io5";  
import { collection, getFirestore, setDoc, doc } from 'firebase/firestore';  
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";  
import { app } from '../../../firebase';  

const db = getFirestore(app);  
const storage = getStorage(app);  

function UploadVideo() {  
  const [videoTitle, setVideoTitle] = useState('');  
  const [videoDescription, setVideoDescription] = useState('');  
  const [selectedLanguage, setSelectedLanguage] = useState('');  
  const [uploadVideo, setUploadVideo] = useState(null);  
  const [uploadThumbnail, setUploadThumbnail] = useState(null);  
  const [uploading, setUploading] = useState(false);  
  const [uploadProgress, setUploadProgress] = useState(0);  
  const [error, setError] = useState('');  
   
  const uploadFile = async (file, path) => { 
    return new Promise((resolve, reject) => { 
      const fileRef = ref(storage, path); 
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
 
  const addVideo = async () => {  
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
 
    const ytref = collection(db, "videos");  
    const ytdoc = doc(ytref, id);  
     
    try { 
      const thumbnailURL = uploadThumbnail ? await uploadFile(uploadThumbnail, `uploads/images/${Date.now()}-${uploadThumbnail.name}`) : ''; 
      const videoURL = uploadVideo ? await uploadFile(uploadVideo, `uploads/videos/${Date.now()}-${uploadVideo.name}`) : ''; 
     
      const localuser = localStorage.getItem('userData');  
      if (!localuser) throw new Error('User data not found'); 
      const userData = JSON.parse(localuser);  
       
      await setDoc(ytdoc, {  
        userid: userData.uid,  
        vid: id,  
        Title: videoTitle,  
        Description: videoDescription,  
        videoUpload: videoURL,  
        thumbnailUpload: thumbnailURL,  
        Language: selectedLanguage,  
      }); 
    
      alert('Video uploaded successfully!'); 
    } catch (error) { 
      console.error('Error uploading video:', error); 
      setError('Failed to upload video.'); 
    } 
  };  
 
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setUploading(true);  
    setError('');  
 
    await addVideo();  
 
    setUploading(false);  
    setVideoTitle('');  
    setVideoDescription('');  
    setSelectedLanguage('');  
    setUploadVideo(null);  
    setUploadThumbnail(null);  
    setUploadProgress(0);  
    handleClose();  
  };  
 
  return (  
    <div style={styles.uploadContent}>  
      <h2 style={styles.heading}>Upload Content</h2>  
      <form style={styles.form} onSubmit={handleSubmit}>  
        <input  
          type="text"  
          placeholder="Video Title"  
          value={videoTitle}  
          onChange={(e) => setVideoTitle(e.target.value)}  
          style={styles.input}  
        />  
        <textarea  
          placeholder="Video Description"  
          value={videoDescription}  
          onChange={(e) => setVideoDescription(e.target.value)}  
          style={{ ...styles.input, ...styles.textarea }}  
        />  
        <label htmlFor="video" style={styles.label}>Upload Video</label>  
        <input  
          id="video"
          type="file"  
          onChange={(e) => setUploadVideo(e.target.files[0])}  
          style={styles.fileInput}  
        />  
        <label htmlFor="thumbnail" style={styles.label}>Upload Thumbnail</label>  
        <input  
          id="thumbnail"  
          type="file"  
          onChange={(e) => setUploadThumbnail(e.target.files[0])}  
          style={styles.fileInput}  
        />  
        <select  
          value={selectedLanguage}  
          onChange={(e) => setSelectedLanguage(e.target.value)}  
          style={styles.select}  
        >  
          <option value="">Select Language</option>  
          <option value="english">English</option>  
          <option value="spanish">Spanish</option>  
          <option value="french">French</option>
          <option value="Hindi">Hindi</option>  
        </select>  
         
        <button type="submit" disabled={uploading} style={styles.button}>Upload</button>  
 
        {uploading && ( 
          <div style={styles.progressContainer}> 
            <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }}></div> 
            <div style={styles.progressText}>{Math.round(uploadProgress)}%</div> 
          </div> 
        )} 
        {error && <p style={styles.error}>{error}</p>} 
      </form>  
    </div>  
  );  
}  
 
const styles = { 
  uploadContent: { 
    padding: '20px', 
    backgroundColor: '#f5f5f5', 
    borderRadius: '8px', 
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', 
    maxWidth: '500px', 
    margin: 'auto', 
    marginTop: '50px', 
  }, 
  heading: { 
    textAlign: 'center', 
    color: '#333', 
    marginBottom: '20px', 
  }, 
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
  }, 
  input: { 
    padding: '10px', 
    margin: '10px 0', 
    borderRadius: '4px', 
    border: '1px solid #ccc', 
    fontSize: '16px', 
  }, 
  textarea: { 
    height: '100px', 
    resize: 'none', 
  }, 
  label: { 
    marginBottom: '5px', 
    fontWeight: 'bold', 
    color: '#555', 
  }, 
  fileInput: { 
    marginBottom: '15px', 
  }, 
  select: { 
    padding: '10px', 
    margin: '10px 0', 
    borderRadius: '4px', 
    border: '1px solid #ccc', 
    fontSize: '16px', 
    backgroundColor: '#fff', 
  }, 
  button: { 
    padding: '12px 20px', 
    backgroundColor: '#28a745', 
    color: '#fff', 
    borderRadius: '4px', 
    border: 'none', 
    cursor: 'pointer', 
    marginTop: '20px', 
  }, 
  progressContainer: { 
    marginTop: '20px', 
    width: '100%', 
    backgroundColor: '#e9ecef', 
    borderRadius: '4px', 
    overflow: 'hidden', 
  }, 
  progressBar: { 
    height: '8px', 
    backgroundColor: '#28a745', 
  }, 
  progressText: { 
    textAlign: 'center', 
    marginTop: '8px', 
    fontSize: '14px', 
    color: '#555', 
  }, 
  error: { 
    color: 'red', 
    marginTop: '10px', 
    textAlign: 'center', 
  }, 
}; 
 
export default UploadVideo;
