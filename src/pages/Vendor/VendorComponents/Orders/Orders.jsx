import React, { useEffect, useState } from 'react';
import { collection, getDocs, where, query, getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../../../../firebase';
import './Orders.css';

function Orders() {
    const [pendinglist, setPendinglist] = useState([]);
    const [loading, setLoading] = useState(true);

    const db = getFirestore(app);  // Initialize Firestore
    const localuser = localStorage.getItem('userData');
    const userData = JSON.parse(localuser); // Replace with actual user data

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const p = query(collection(db, 'orders'), where('vendorid', '==', userData.uid));
                const querySnapshot = await getDocs(p); 
                const pendingOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setPendinglist(pendingOrders);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }); // Dependency array

    const handleApprove = async (orderid) => {
        try {
            // 1. Find the order details
            const order = pendinglist.find(order => order.id === orderid);
            if (!order) {
                console.error("Order not found:", orderid);
                return;
            }
        
            // 2. Update order status to approved
            const orderDoc = doc(db, 'orders', orderid);  // Reference to the order document
            console.log("Updating order:", orderid);
            await updateDoc(orderDoc, { approve: true });
        
            // 3. Update the vendor's inventory quantity
            const vendorDocRef = doc(db, 'vendors', order.productid);  // Reference to the vendor document
            const vendorDoc = await getDoc(vendorDocRef);
            if (vendorDoc.exists()) {
                const vendorData = vendorDoc.data();
                console.log("Vendor data:", vendorData);
                await updateDoc(vendorDocRef, {
                    quantity: (parseInt(vendorData.quantity) - parseInt(order.quantity)).toString()
                });
                console.log("Vendor inventory updated successfully.");
            } else {
                console.log(`Vendor ${order.productid} not found.`);
            }

            // create Inventory
            function randomAlphaNumeric(length) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                  result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
              }
          
            const id = randomAlphaNumeric(10);
            const vendorData = vendorDoc.data();

            const invref = collection(db,'inventory');
            const invdoc = doc(invref,id);
            await setDoc(invdoc,{
                farmer_id:order.farmerid,
                product_name:vendorData.product_name,
                category:vendorData.category,
                quantity:order.quantity,
                imageurl:order.product_image,
                inventoryid:id,
            })
        } catch (error) {
            console.error("Error approving order: ", error);
        }
    };
    

    const handleReject = (orderid) => {
        // Implement the logic to handle order rejection
        console.log(`Order ${orderid} rejected`);
    };

    function randomAlphaNumeric(length) { 
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
        let result = ''; 
        for (let i = 0; i < length; i++) { 
            result += chars.charAt(Math.floor(Math.random() * chars.length)); 
        } 
        return result; 
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="orders-container">
            {pendinglist.map((order, index) => (
                <div key={index} className="order-card">
                    <div className="order-image">
                        <img src={order.product_image} alt={`Product ${index}`} />
                    </div>
                    <div className="order-details">
                        <p><strong>Id:</strong> {order.orderid}</p>
                        <p><strong>Name:</strong> {order.product_name}</p>
                    </div>
                    <div className="order-details">
                        <p><strong>Order by Whom:</strong> {order.farmername}</p>
                        <p><strong>Date:</strong> {order.date}</p>
                    </div>
                    <div className={`order-status ${order.approve ? 'dispatched' : 'pending'}`}>
                        <p>Current Status: {order.approve ? 'Dispatched' : 'Pending'}</p>
                    </div>
                    {!order.approve && (
                        <div className="order-actions">
                            <button className="order-button approve-button" onClick={() => handleApprove(order.id)}>✔</button>
                            <button className="order-button reject-button" onClick={() => handleReject(order.id)}>✖</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Orders;
