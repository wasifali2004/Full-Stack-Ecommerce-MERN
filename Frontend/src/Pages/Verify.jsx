import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    const [searchParams, setSearchParams] = useState()
    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try{
            if(!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifystripw',{success, orderId}, {headers:{token}})
            if(response.data.success) {
                setCartItems({})
                navigate('/orders')
            }
            else {
                navigate('/cart')
            }
        }
        catch(err) {    
            console.log(err)
            toast.error(err.message)
        }
    }

    useEffect(()=> {

    },[token ])
  return (
    <div>
        
    </div>
  )
}

export default Verify