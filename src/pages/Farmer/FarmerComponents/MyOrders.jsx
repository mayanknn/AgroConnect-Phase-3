import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../firebase';

function ProductCard({ product, onApprove, onReject }) {
  return (
    <div style={styles.orderCard}>
      <div style={styles.imageContainer}>
        <img src={product.imageUrl} alt={`Product ${product.orderid}`} style={styles.productImage} />
      </div>
      <div style={styles.orderContent}>
        <p style={styles.text}><strong>Id:</strong> {product.refid}</p>
        <p style={styles.text}><strong>Name:</strong> {product.product_name}</p>
        <p style={styles.text}><strong>Buyer:</strong> {product.buyer_name}</p>
        <p style={styles.text}><strong>Date:</strong> {new Date(product.timestamp).toLocaleDateString()}</p>
        <p style={{ ...styles.status, ...product.approve ? styles.dispatched : styles.pending }}>
          {product.approve ? 'Dispatched' : 'Pending'}
        </p>
        {!product.approve && (
          <div style={styles.orderActions}>
            <button style={styles.approveButton} onClick={() => onApprove(product)}>✔ Approve</button>
            <button style={styles.rejectButton} onClick={() => onReject(product.id)}>✖ Reject</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MyOrders() {
  const [products, setProducts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localuser = localStorage.getItem('userData');
        const userData = JSON.parse(localuser);

        if (!userData || !userData.uid) {
          console.error('User data not found or user ID is missing.');
          return;
        }

        const q = query(collection(db, 'buyorderdet'), where('farmerId', '==', userData.uid));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [db]);

  const handleApprove = async (product) => {
    try {
      const docref = doc(collection(db, 'buyorderdet'), product.refid);
      await updateDoc(docref, { approve: true });

      const orderDocRef = doc(db, 'buyorder', product.itemId);
      const orderDocSnapshot = await getDoc(orderDocRef);

      if (orderDocSnapshot.exists()) {
        const orderData = orderDocSnapshot.data();
        const currentQuantity = parseInt(orderData.quantity);
        const newQuantity = currentQuantity - parseInt(product.quantity);

        await updateDoc(orderDocRef, {
          quantity: newQuantity.toString()
        });

        setProducts(prevProducts => prevProducts.map(p => p.id === product.id ? { ...p, approve: true } : p));
      }
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleReject = (id) => {
    console.log(`Reject order with ID: ${id}`);
  };

  return (
    <div style={styles.inventoryContainer}>
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
        ))
      ) : (
        <p style={styles.noProductsMessage}>No products found.</p>
      )}
    </div>
  );
}

const styles = {
  inventoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
  },
  orderCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  orderContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  text: {
    margin: 0,
    fontSize: '1rem',
    color: '#333',
  },
  status: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dispatched: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  pending: {
    backgroundColor: '#FF9800',
    color: '#fff',
  },
  orderActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  approveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    flex: 1,
    marginRight: '0.5rem',
    transition: 'background-color 0.3s ease',
  },
  rejectButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    flex: 1,
    transition: 'background-color 0.3s ease',
  },
  noProductsMessage: {
    textAlign: 'center',
    color: '#777',
    fontSize: '1rem',
  },
};

export default MyOrders;
