import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { app } from '../../../../firebase';
import './Inventory.css'; // Ensure this path is correct

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.product_name} />
      <h2>
        <b>Product Name:</b> {product.product_name}
      </h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Quantity [in KG]:</strong> {product.quantity}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Vendor ID:</strong> {product.vendorid}</p>
    </div>
  );
}

function Inventory() {
  const [products, setProducts] = useState([]);
  const db = getFirestore(app); // Initialize Firestore

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localuser = localStorage.getItem('userData');
        const userData = JSON.parse(localuser);

        if (!userData || !userData.uid) {
          console.error('User data not found or user ID is missing.');
          return;
        }

        // Query the 'vendors' collection where the 'vendorid' matches the user's ID
        const q = query(collection(db, 'vendors'), where('vendorid', '==', userData.uid));

        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [db]); // Include db in the dependency array

  return (
    <div className="inventory-container">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default Inventory;
