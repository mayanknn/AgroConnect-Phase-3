import React, { useState } from 'react';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
import { app } from '../../../firebase';

const db = getFirestore(app);
const storage = getStorage(app);

function SellCrops() {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('Available');
    const [category, setCategory] = useState('Rice');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');

        try {
            if (parseInt(quantity, 10) <= 0) {
                setError('Quantity must be greater than zero.');
                setUploading(false);
                return;
            }

            const isAvailable = await checkInventory(productName, parseInt(quantity, 10));
            if (!isAvailable) {
                setError('Insufficient inventory for the requested quantity.');
                setUploading(false);
                return;
            }

            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `images/${image.name}`);
                const uploadTask = uploadBytesResumable(imageRef, image);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => {
                            console.error("Error uploading image: ", error);
                            reject(error);
                        },
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            function randomAlphaNumeric(length) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            }

            const id = randomAlphaNumeric(10);
            const cropsCollectionRef = collection(db, 'buyorder');
            const buyorderDoc = doc(cropsCollectionRef, id);
            const localuser = localStorage.getItem('userData');
            if (!localuser) throw new Error('User data not found');
            
            const userData = JSON.parse(localuser);
            await setDoc(buyorderDoc, {
                productName,
                quantity: parseInt(quantity, 10),
                price: parseFloat(price),
                status,
                category,
                imageUrl,
                buyid: id,
                farmer_id: userData.uid,
                farmer_name: userData.Username,
            });

            alert('Data submitted successfully!');
            resetForm();
        } catch (error) {
            console.error("Error submitting data: ", error);
            setError('Error submitting data. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setProductName('');
        setQuantity('');
        setPrice('');
        setStatus('Available');
        setCategory('Rice');
        setImage(null);
        setUploadProgress(0);
    };

    // Mock function for inventory check
    const checkInventory = async (productName, quantity) => {
        // This is a placeholder for the actual inventory check logic
        return true;
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Sell Your Crops</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="product_name" style={styles.label}>Product Name</label>
                    <input
                        id="product_name"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="quantity" style={styles.label}>Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="price" style={styles.label}>Price</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="status" style={styles.label}>Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        style={styles.select}
                    >
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="category" style={styles.label}>Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={styles.select}
                    >
                        <option value="Rice">Rice</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Maze">Maze</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="image" style={styles.label}>Image of the Crop</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />
                </div>
                <button type="submit" disabled={uploading} style={styles.submitButton}>
                    {uploading ? `Uploading... ${uploadProgress.toFixed(2)}%` : 'Submit'}
                </button>
                {error && <p style={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

const styles = {
    container: {
        width: '50%',
        margin: '3vh auto',
        padding: '2vw',
        backgroundColor: '#fff',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif'
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: '500',
        color: '#333'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    fileInput: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease'
    },
    error: {
        color: 'red',
        marginTop: '10px'
    }
};

export default SellCrops;
