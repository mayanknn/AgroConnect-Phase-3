import React, { useEffect, useState } from "react"; 
import { collection, query, where, getDocs, getFirestore, doc, updateDoc, addDoc, setDoc } from "firebase/firestore"; 
import { app } from "../../../firebase"; 
 
const db = getFirestore(app); 
 
function Resource() { 
  const [inventory, setInventory] = useState([]); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => { 
    const localuser = localStorage.getItem("userData"); 
    if (!localuser) { 
      console.error("User data not found in localStorage"); 
      setLoading(false); 
      return; 
    } 
 
    const userData = JSON.parse(localuser); 
 
    if (!userData || !userData.uid) { 
      console.error("Invalid user data"); 
      setLoading(false); 
      return; 
    } 
 
    const fetchUserInventory = async () => { 
      try { 
        console.log(userData.uid); 
        const inventoryQuery = query( 
          collection(db, "inventory"), 
          where("farmer_id", "==", userData.uid) 
        ); 
        const querySnapshot = await getDocs(inventoryQuery); 
        const userInventory = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(), 
        })); 
        console.log("Fetched Inventory:", userInventory); 
        setInventory(userInventory); 
      } catch (error) { 
        console.error("Error fetching user inventory: ", error); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchUserInventory(); 
  }, []); 
 
  const handleUseResource = async (itemId, availableQuantity) => { 
    const quantityString = prompt("Enter the quantity you want to use:"); 
    const quantity = parseInt(quantityString, 10); 
 
    if (isNaN(quantity) || quantity <= 0 || quantity > availableQuantity) { 
      alert("Invalid quantity!"); 
      return; 
    } 
 
    console.log(`Using ${quantity} from item ID: ${itemId}`); 
 
    try { 
      const itemRef = doc(db, "inventory", itemId); 
      const newQuantity = availableQuantity - quantity; 
 
      // Update inventory 
      await updateDoc(itemRef, { 
        quantity: newQuantity, 
      }); 
      function randomAlphaNumeric(length) { 
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
        let result = ''; 
        for (let i = 0; i < length; i++) { 
          result += chars.charAt(Math.floor(Math.random() * chars.length)); 
        } 
        return result; 
      } 
 
      const id = randomAlphaNumeric(10); 
      // Store in history 
      const historyRef = collection(db, "history"); 
      const historydoc = doc(historyRef,id); 
      await setDoc(historydoc, { 
        farmer_id: JSON.parse(localStorage.getItem("userData")).uid, 
        historyid:id, 
        item_id: itemId, 
        quantity_used: quantity, 
        timestamp: new Date(), 
        farmer_name:JSON.parse(localStorage.getItem("userData")).Username, 
        farmer_photo:JSON.parse(localStorage.getItem("userData")).ProfileImage, 
      }); 
 
      // Update state 
      setInventory((prevInventory) => 
        prevInventory.map((item) => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item 
        ) 
      ); 
    } catch (error) { 
      console.error("Error updating inventory and storing history: ", error); 
    } 
  }; 
 
  if (loading) { 
    return <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>; 
  } 
 
  if (inventory.length === 0) { 
    return <div style={{ textAlign: "center", marginTop: "20px" }}>No inventory items found.</div>; 
  } 
 
  return ( 
    <div style={{ padding: "20px" }}> 
      {inventory.map((item) => ( 
        <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0", borderRadius: "8px" }}> 
          <h3 style={{ margin: "0 0 10px 0" }}>{item.name}</h3> 
          <p style={{ margin: "0 0 5px 0" }}>Quantity: {item.quantity}</p> 
          <p style={{ margin: "0 0 10px 0" }}>Category: {item.category}</p> 
          <img src={item.imageurl} alt="" style={{width:'10vw'}}/> 
          <button  
            style={{
padding: "5px 10px", 
              backgroundColor: "#28a745", 
              color: "#fff", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer" 
            }}  
            onClick={() => handleUseResource(item.id, item.quantity)} 
          > 
            Use 
          </button> 
        </div> 
      ))} 
    </div> 
  ); 
} 
 
export default Resource;