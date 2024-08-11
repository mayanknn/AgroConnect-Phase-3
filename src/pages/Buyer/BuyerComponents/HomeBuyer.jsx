import React, { useState, useEffect } from 'react'; 
import { collection, getDocs, getFirestore, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore'; 
import { app } from '../../../firebase'; 

const db = getFirestore(app); 

function HomeBuyer() { 
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [address, setAddress] = useState(''); 
  const [quantity, setQuantity] = useState('1'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const buyerId = 'buyer123'; // Replace with actual buyer ID from authentication

  useEffect(() => { 
    const fetchItems = async () => { 
      try { 
        const querySnapshot = await getDocs(collection(db, 'buyorder')); // Using 'buyorder' as the collection name 
        const itemList = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(), 
        })); 
        setItems(itemList); 
      } catch (error) { 
        console.error('Error fetching items: ', error); 
      } finally { 
        setLoading(false); 
      } 
    }; 

    fetchItems(); 
  },[items,setItems]); 

  const handleInitializePayment = async () => { 
    if (selectedItem) {
      const { id: farmerId } = selectedItem;
      const orderData = {
        buyerId,
        farmerId,
        address,
        quantity,
        itemId: selectedItem.id,
        timestamp: new Date(),
      };

      try {
        function randomAlphaNumeric(length) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
          for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        }

        const id = randomAlphaNumeric(10);
        // Save order data to a collection, e.g., 'orders'
        const buyerorderref = collection(db, 'buyorderdet');
        const buyerorderdoc = doc(buyerorderref, id);
        const localuser = localStorage.getItem('userData');
        const userData = JSON.parse(localuser);

        await setDoc(buyerorderdoc, {
          buyerId: userData.uid,
          buyer_name:userData.Username,
          farmerId: selectedItem.farmer_id,
          refid:id,
          address,
          quantity,
          itemId: selectedItem.id,  // Ensure this is the correct field
          imageUrl: selectedItem.imageUrl,
          timestamp: Date.now(),
          approve:false,
          price:selectedItem.price,
          product_name:selectedItem.productName,
          category:selectedItem.category
        });

        console.log('Order recorded:', orderData);

        // Update quantity in the 'buyorder' collection
        
        console.log('Order updated:', orderData);
      } catch (error) {
        console.error('Error recording order: ', error);
      }
    }

    // Reset state
    setIsPopupOpen(false);
    setAddress('');
    setQuantity('1');
    setSelectedItem(null);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (selectedItem && (value > selectedItem.quantity || value < 1)) {
      // Optionally, display a message to the user
      return;
    }
    setQuantity(value);
  };

  if (loading) { 
    return <p>Loading...</p>; 
  } 

  return (
    <> 
        <h1 style={{textAlign:'center',marginTop:'5vh'}}>All Crops</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px'}}> 

      {items.map((item) => ( 
        <div 
        key={item.id} 
        style={{ 
          border: '1px solid #ccc', 
          borderRadius: '12px', 
          padding: '20px', 
          width: '240px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          backgroundColor: '#fff',
          overflow: 'hidden',
          cursor: 'pointer',
          width:'25vw'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
      > 
        <img 
          src={item.imageUrl}
          alt={item.productName} 
          style={{ 
            width: '100%', 
            height: '160px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            marginBottom: '15px' 
          }} 
        /> 
        <h3 style={{ 
          margin: '0 0 10px', 
          fontSize: '1.2rem', 
          color: '#333' 
        }}>{item.productName}</h3> 
        <p style={{ margin: '5px 0', color: '#555' }}><strong>Category:</strong> {item.category}</p> 
        <p style={{ margin: '5px 0', color: '#555' }}><strong>Farmer Name:</strong> {item.farmer_name}</p> 
        <p style={{ margin: '5px 0', color: '#555' }}><strong>Price:</strong> {item.price}</p> 
        <p style={{ margin: '5px 0', color: '#555' }}><strong>Quantity:</strong> {item.quantity}</p> 
        <p style={{ margin: '5px 0', color: '#555' }}><strong>Status:</strong> {item.status}</p> 
        <button 
          onClick={() => {
            setSelectedItem(item);
            setIsPopupOpen(true);
          }} 
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            border: 'none', 
            backgroundColor: '#4CAF50', 
            color: '#fff', 
            fontSize: '1rem', 
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Buy
        </button>
      </div>
      ))} 

      {isPopupOpen && (
        <div style={{
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0', 
          bottom: '0', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '20px', 
            maxWidth: '400px', 
            width: '100%'
          }}>
            <h3>Enter Address and Quantity</h3>
            <textarea
              placeholder="Enter your address here"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%', 
                height: '100px', 
                marginBottom: '10px', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #ccc'
              }}
            />
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={handleQuantityChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #ccc', 
                marginBottom: '10px'
              }}
            />
            <div>
              <button onClick={handleInitializePayment} style={{
                marginRight: '10px'
              }}>Order</button>
              <button onClick={() => {
                setIsPopupOpen(false);
                setAddress('');
                setQuantity('1');
                setSelectedItem(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div> 
    </>
  ); 
} 

export default HomeBuyer;
