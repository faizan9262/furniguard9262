import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { getAllProducts, getAllWishlistProducts } from '../helper/api-communicator.js';
import { useAuth } from './AuthContext.jsx';

export const StyleContext = createContext();

export const StyleContextProvider = (props) => {
  const [products,setProducts] = useState([])
  const [wishlist, setWishlist] = useState([]);
  const user = useAuth()
 
  useEffect(()=>{
    const getAllProdductsfromDB = async()=>{
      const data = await getAllProducts() 
      // console.log("Data:",data);
      setProducts(data.ratedProducts)
    }
    getAllProdductsfromDB()
  },[])

    useEffect(() => {
      const fetchWishlist = async () => {
        try {
          const response = await getAllWishlistProducts();
          setWishlist(response.data.products || []);
          user.setWishlistCount(response.data.products.length);
        } catch (error) {
          console.error("Error fetching wishlist:", error.message);
        }
      };
  
      fetchWishlist();
    }, []);
  

  useEffect(()=>{
    // console.log("Products Array:",products);
  },[products])

  const value = {
    products,
    wishlist,
    setWishlist
  };
  return (
    <StyleContext.Provider value={value}>
      {props.children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
