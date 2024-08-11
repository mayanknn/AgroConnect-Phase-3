import { collection, getDocs, where, query, getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

function PurchaseMaterial() {
  const db = getFirestore(app);
  const [allproducts, setAllProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  // Pay functions
  const orderPlace = () => {
    console.log("Order placed");
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const pay = async (product, vendorDetails) => {
    if (!vendorDetails) {
      alert("Vendor details not found.");
      return;
    }

    let amount = 100; // Adjust this amount based on your needs

    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: "rzp_test_AWrlyaXOO9ncih", // Your Razorpay API key
        amount: parseInt(amount * 100),
        currency: "INR",
        name: vendorDetails.Username,
        description: "Test Transaction",
        image: vendorDetails.ProfileImage,
        handler: function (response) {
          console.log("Payment Response:", response);
          orderPlace(); // Call your function to handle post-payment tasks
        },
        prefill: {
          name: vendorDetails.Username,
          email: vendorDetails.Email,
          contact: vendorDetails.Phone,
        },
        notes: {
          address: address,
          product_details: JSON.stringify(product),
        },
        theme: {
          color: "#158993",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Failed to load Razorpay SDK:", error);
      alert("Payment initialization failed.");
    }
  };

  const getVendorById = async (vendorId) => {
    const vendorRef = doc(db, 'users', vendorId);
    const vendorSnapshot = await getDoc(vendorRef);
    if (vendorSnapshot.exists()) {
      return vendorSnapshot.data();
    } else {
      return null;
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      const productsQuery = query(collection(db, 'vendors'));
      const vendorsQuery = query(collection(db, 'users'), where('role', '==', 'vendor'));

      const productsSnapshot = await getDocs(productsQuery);
      const vendorsSnapshot = await getDocs(vendorsQuery);

      const vendorList = vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const productsList = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setAllProducts(productsList);
      setVendors(vendorList);
    };

    fetchCards();
  }, [db]);

  const getVendorDetails = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor || null;
  };

  const addOrder = async (product) => {
    const randomAlphaNumeric = (length) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const id = randomAlphaNumeric(10);
    console.log('Generated ID:', id);

    const userdata = JSON.parse(localStorage.getItem('userData'));
    if (!userdata) {
      console.error('User data not found in localStorage');
      return;
    }

    const orderRef = collection(db, 'orders');
    const orderdoc = doc(orderRef, id);

    await setDoc(orderdoc, {
      orderid: id,
      vendorid: product.vendorid,
      quantity: quantity[product.id] || 1,
      farmerid: userdata.uid,
      approve: false,
      date: Date.now(),
      productid: product.id,
      product_name: product.product_name,
      farmername: userdata.Username,
      product_image: product.image || 'default-image.png',
      address: address,
    });

    console.log('Order added successfully');
    setIsPopupOpen(false);
    setAddress('');
  };

  const handleQuantityChange = (productId, value) => {
    setQuantity(prevState => ({
      ...prevState,
      [productId]: value
    }));
  };

  const handleInitializePayment = async () => {
    if (!selectedProduct) {
      alert("No product selected.");
      return;
    }
    const vendorDetails = await getVendorById(selectedProduct.vendorid);
    if (vendorDetails) {
      await pay(selectedProduct, vendorDetails);
    } else {
      alert("Vendor details not found.");
    }
  };

  return (
    <div>
      {allproducts.map(product => (
        <div key={product.id} style={productCardStyle}>
          <div>
            <img src={product.image || 'default-image.png'} alt={product.product_name} style={productImageStyle} />
          </div>
          <div>
            <h2>{product.product_name}</h2>
            <p>{product.product_desc}</p>
            <p><strong>Quantity Available:</strong> {product.quantity}</p>
            <p><strong>Vendor:</strong> {getVendorDetails(product.vendorid)?.Username || 'Unknown Vendor'}</p>
            <label>
              Quantity to Order:
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity[product.id] || ''}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              />
            </label>
            <button onClick={() => {
              setSelectedProduct(product);
              setIsPopupOpen(true);
            }}>Add Order</button>
          </div>
        </div>
      ))}

      {/* Popup Component */}
      {isPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupStyle}>
            <h3>Enter Address</h3>
            <textarea
              placeholder="Enter your address here"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={textareaStyle}
            />
            <div>
              <button className="payment-button" onClick={handleInitializePayment}>Initialize Payment</button>
              <button className="credit-card-button" onClick={() => navigate('acc')}>Pay Through Our Own Credit Card</button>
              <button onClick={() => addOrder(selectedProduct)}>Order</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const productCardStyle = {
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
};

const productImageStyle = {
  width: '150px',
  height: '150px',
  marginRight: '16px',
  objectFit: 'cover',
};

const popupOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: '300px',
};

const textareaStyle = {
  width: '100%',
  height: '100px',
  marginBottom: '10px',
};

// Add CSS styles for the credit card button
const style = `
  .credit-card-button {
    background-color: #158993;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s, transform 0.3s;
    position: relative;
    overflow: hidden;
  }

  .credit-card-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulsate 3s infinite;
  }

  .credit-card-button:hover {
    background-color: #0a6f6f;
    transform: scale(1.05);
  }

  @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.5);
      opacity: 1;
    }
  }
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = style;
document.head.appendChild(styleElement);

export default PurchaseMaterial;
