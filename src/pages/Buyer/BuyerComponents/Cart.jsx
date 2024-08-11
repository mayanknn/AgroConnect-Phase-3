import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { app } from '../../../firebase';

function ProductCard({ product }) { 
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.product_name} />
      <h2>
        <b>Product Name:</b> {product.product_name}
      </h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Quantity [in KG]:</strong> {product.quantity}</p>
      <p><strong>Vendor ID:</strong> {product.farmerId}</p>
    </div>
  );
}

function Cart() {
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

        // Query the 'buyorderdet' collection where the 'buyerid' matches the user's ID
        const q = query(collection(db, 'buyorderdet'), where('buyerId', '==', userData.uid));

        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [db,products,setProducts]); 
  console.log(products);
  return (
    <>
    <h1 style={{textAlign:'center',marginTop:'5vh'}}>My Ordered Items</h1>
    <div className="inventory-container">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
    </>
  );
}

export default Cart;
