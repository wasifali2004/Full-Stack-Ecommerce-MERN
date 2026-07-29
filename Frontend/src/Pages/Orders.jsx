import { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext.js'
import Title from '../Components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const {backendUrl, token, currency, navigate} = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const loadOrderData = useCallback(async () => {
    if(!token) return

    try{
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {headers:{token}},
      )
      if(response.data.success) {
        const items = response.data.orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
          })),
        )
        setOrderData(items)
      } else {
        toast.error(response.data.message)
      }
    } catch(error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }, [backendUrl, token])

  useEffect(() => {
    if (!token) {
      navigate('/login', {replace: true})
      return
    }
    loadOrderData()
  }, [loadOrderData, navigate, token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1='MY' text2='ORDERS' />
      </div>

      {orderData.length === 0 && (
        <p className='py-12 text-center text-gray-500'>You have not placed any orders yet.</p>
      )}

      <div>
        {orderData.map((item) => (
          <div key={`${item.orderId}-${item._id}-${item.variant || item.size}`} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img src={item.image[0]} alt={item.name} className='w-16 sm:w-20' />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Variant: {item.variant || item.size || 'Standard'}</p>
                  {item.color && <p>Color: {item.color}</p>}
                </div>
                <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                <p className='mt-1'>Payment: <span className='text-gray-400'>{item.payment ? 'Paid' : item.paymentMethod === 'COD' ? 'Cash on delivery' : 'Pending'}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <span className='min-w-2 h-2 rounded-full bg-green-500'></span>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>
              <button type='button' onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
