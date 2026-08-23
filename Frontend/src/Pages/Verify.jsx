import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext.js'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('sessionId')

    useEffect(() => {
        if(!token) {
            navigate('/login', {replace: true})
            return
        }

        const verifyPayment = async () => {
            try{
                const response = await axios.post(
                    `${backendUrl}/api/order/verifystripe`,
                    {success, orderId, sessionId},
                    {headers:{token}},
                )
                if(response.data.success) {
                    setCartItems({})
                    navigate('/orders', {replace: true})
                } else {
                    toast.error(response.data.message || 'Payment was not completed')
                    navigate('/cart', {replace: true})
                }
            } catch(error) {
                toast.error(error.response?.data?.message || error.message)
                navigate('/cart', {replace: true})
            }
        }

        verifyPayment()
    }, [backendUrl, navigate, orderId, sessionId, setCartItems, success, token])

    return (
      <div className='min-h-[50vh] flex items-center justify-center text-gray-600'>
        Verifying your payment...
      </div>
    )
}

export default Verify