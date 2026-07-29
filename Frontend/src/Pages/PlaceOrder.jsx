import { useContext, useEffect, useState } from 'react'
import Title from '../Components/Title'
import CartTotal from '../Components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../Context/ShopContext.js'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const {navigate, backendUrl, token, cartItems, setCartItems, products} = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', street:'', city:'', state:'', zipcode:'', country:'', phone:''
  })

  useEffect(() => {
    if (!token) navigate('/login', {replace: true})
  }, [navigate, token])

  const onChangeHandler = (event) => {
    setFormData((data) => ({...data, [event.target.name]: event.target.value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }

    const orderItems = []
    for(const productId in cartItems) {
      for(const variant in cartItems[productId]) {
        const quantity = cartItems[productId][variant]
        const product = products.find((item) => item._id === productId)
        if(product && quantity > 0) {
          // variant may encode color as "variant::color:ColorName"
          let color = undefined
          let bareVariant = variant
          const parts = String(variant).split('::color:')
          if (parts.length === 2) {
            bareVariant = parts[0]
            color = parts[1]
          }
          orderItems.push({_id: product._id, variant: bareVariant, color, quantity})
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }

    setSubmitting(true)
    try{
      const endpoint = method === 'stripe' ? '/api/order/stripe' : '/api/order/place'
      const response = await axios.post(
        backendUrl + endpoint,
        {address: formData, items: orderItems},
        {headers: {token}},
      )

      if(!response.data.success) {
        toast.error(response.data.message)
        return
      }

      if (method === 'stripe') {
        window.location.assign(response.data.session_url)
      } else {
        setCartItems({})
        navigate('/orders')
      }
    } catch(error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1='DELIVERY' text2='INFORMATION' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" className='border-gray-300 border rounded py-1.5 px-3.5 w-full' placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" className='border-gray-300 border rounded py-1.5 px-3.5 w-full' placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="text" className='border-gray-300 border rounded py-1.5 px-3.5 w-full' placeholder='Zip code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="tel" className='border-gray-300 rounded border py-1.5 px-3.5 w-full' placeholder='Phone' />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'><CartTotal/></div>
        <div className='mt-12'>
          <Title text1='PAYMENT' text2='METHOD' />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <button type='button' onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-blue-600': ''}`}></span>
              <img src={assets.stripe_logo} alt="Stripe" className='h-5 mx-4' />
            </button>
            <button type='button' onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-blue-600': ''}`}></span>
              <span className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</span>
            </button>
          </div>

          <div className='w-full text-end mt-8'>
            <button disabled={submitting} type='submit' className='bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed text-white px-16 py-3 text-sm transition-colors'>
              {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
