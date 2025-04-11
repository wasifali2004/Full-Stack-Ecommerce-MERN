import React, { createContext, useEffect } from 'react'
import { useState } from 'react';
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
export const ShopContext = createContext();
import axios from 'axios'

const ShopContextProvider = (props) => {
    const currency = '$'
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false) 
    const [cartItems, setCartItems] = useState({})
    const navigate = useNavigate();
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')

    const addToCart = async (itemId, size) => {
      let cartData = structuredClone(cartItems);
      if(!size) {
        toast.error('Select Product Size');
        return
      }

      if(cartData[itemId]) {
        if(cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        }
        else {
          cartData[itemId][size] = 1;
        }
      }
      else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      setCartItems(cartData)

      if(token) {
        try{
          await axios.post(backendUrl + '/api/cart/add', {itemId, size},{ headers:{token} })
          await getUserCart();
        }
        catch(err) {
          console.log(err)
          toast.error(err.message)
        }
      }
    }

    const getCartAmount = () => {
      let totalAmount = 0;
      for(const items in cartItems) {
        let itemInfo = products.find(product => product._id === items)
        for(const item in cartItems[items]) {
          try{
            if(cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          }
          catch(err) {
            
          }
        } 
      }
      return totalAmount;
    }

    const getCartCount = () => {
      let totalCount = 0;
      for(const items in cartItems) {
          for(const item in cartItems[items]) {
            try {
              if(cartItems[items][item] > 0) {
                totalCount += cartItems[items][item]
              }
            }
            catch(err){
              
            }
          }
        }
      return totalCount;
    }
    
     const updateQuantity = async (itemId,size, quantity) => {
      const cartData = structuredClone(cartItems);
      cartData[itemId][size] = quantity
      setCartItems(cartData)

      if(token) {
        try{
          await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity},  { headers: {token}})
        }
        catch(err) {
          console.log(err)
          toast.error(err.message)
        }
      }
     }

    const getProductsData = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list')
        if(response.data.success) {
          setProducts(response.data.products)
        }
        else {
          toast.error(response.data.message)
        }
      }
      catch(err) {
        console.log(err)
        toast.error(err.message)
      }
    }

    const getUserCart = async (token ) => {
      try {
        const response = await axios.post(backendUrl + '/api/cart/get', {},   { headers: {token} })
        if(response.data.success) {
          setCartItems(response.data.cartData)
        }
        else {
          console.log("Not get user cart data from backend.")
          return res.json({success:false, message:"Not Fetched data from Backend"})
        }
      }
      catch(err) {
        console.log(err)
        toast.error(err.message)
      }
    }

    useEffect(() => {
      if(token) {
        getProductsData()
      }
    },[token])

    useEffect(() => {
      if(!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'))
        getUserCart(localStorage.getItem('token'))
      }
    },[])

    const value = {
        currency, products, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart,getCartCount, updateQuantity,getCartAmount, navigate, backendUrl,token, setToken 
    }

  return (
    <ShopContext.Provider value={value}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider