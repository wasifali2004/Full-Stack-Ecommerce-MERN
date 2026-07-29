import { useCallback, useEffect, useMemo, useState } from 'react'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from './ShopContext.js'

const getErrorMessage = (error) => error.response?.data?.message || error.message

const ShopContextProvider = ({children}) => {
    const currency = '$'
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState(() => localStorage.getItem('token') || '')
    const navigate = useNavigate()

    const getProductsData = useCallback(async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`)
        if(response.data.success) {
          setProducts(response.data.products)
        } else {
          toast.error(response.data.message)
        }
      } catch(error) {
        toast.error(getErrorMessage(error))
      }
    }, [backendUrl])

    const getUserCart = useCallback(async (authToken) => {
      if (!authToken) return

      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          {headers: {token: authToken}},
        )
        if(response.data.success) {
          setCartItems(response.data.cartData || {})
        } else {
          toast.error(response.data.message)
        }
      } catch(error) {
        toast.error(getErrorMessage(error))
      }
    }, [backendUrl])

    const addToCart = useCallback(async (itemId, variant, color) => {
      if(!variant) {
        toast.error('Select a product variant')
        return
      }

      const previousCart = structuredClone(cartItems)
      const cartData = structuredClone(cartItems)
      const variantKey = color ? `${variant}::color:${color}` : variant
      cartData[itemId] ??= {}
      cartData[itemId][variantKey] = (cartData[itemId][variantKey] || 0) + 1
      setCartItems(cartData)

      if(token) {
        try{
          const response = await axios.post(
            `${backendUrl}/api/cart/add`,
            {itemId, variant: variantKey},
            {headers:{token}},
          )
          if (!response.data.success) {
            throw new Error(response.data.message)
          }
          setCartItems(response.data.cartData || cartData)
        } catch(error) {
          setCartItems(previousCart)
          toast.error(getErrorMessage(error))
        }
      }
    }, [backendUrl, cartItems, token])

    const getCartAmount = useCallback(() => {
      let totalAmount = 0

      for(const productId in cartItems) {
        const product = products.find((item) => item._id === productId)
        if (!product) continue

        for(const variant in cartItems[productId]) {
          const quantity = cartItems[productId][variant]
          if(quantity > 0) totalAmount += product.price * quantity
        }
      }

      return totalAmount
    }, [cartItems, products])

    const getCartCount = useCallback(() => {
      let totalCount = 0
      for(const productId in cartItems) {
        for(const variant in cartItems[productId]) {
          const quantity = cartItems[productId][variant]
          if(quantity > 0) totalCount += quantity
        }
      }
      return totalCount
    }, [cartItems])

    const updateQuantity = useCallback(async (itemId, variant, quantity) => {
      const normalizedQuantity = Math.max(0, Number(quantity) || 0)
      const previousCart = structuredClone(cartItems)
      const cartData = structuredClone(cartItems)

      if (normalizedQuantity === 0) {
        if (cartData[itemId]) {
          delete cartData[itemId][variant]
          if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId]
        }
      } else {
        cartData[itemId] ??= {}
        cartData[itemId][variant] = normalizedQuantity
      }
      setCartItems(cartData)

      if(token) {
        try{
          const response = await axios.post(
            `${backendUrl}/api/cart/update`,
            {itemId, variant, quantity: normalizedQuantity},
            {headers: {token}},
          )
          if (!response.data.success) {
            throw new Error(response.data.message)
          }
          setCartItems(response.data.cartData || cartData)
        } catch(error) {
          setCartItems(previousCart)
          toast.error(getErrorMessage(error))
        }
      }
    }, [backendUrl, cartItems, token])

    useEffect(() => {
      getProductsData()
    }, [getProductsData])

    useEffect(() => {
      if(token) {
        localStorage.setItem('token', token)
        getUserCart(token)
      }
    }, [getUserCart, token])

    const value = useMemo(() => ({
      currency,
      products,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      setCartItems,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate,
      backendUrl,
      token,
      setToken,
    }), [
      addToCart,
      backendUrl,
      cartItems,
      getCartAmount,
      getCartCount,
      navigate,
      products,
      search,
      showSearch,
      token,
      updateQuantity,
    ])

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
