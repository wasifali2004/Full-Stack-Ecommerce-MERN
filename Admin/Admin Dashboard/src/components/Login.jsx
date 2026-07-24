import { useState } from 'react'
import { backendUrl } from '../config'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = ({setToken}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();
            const response = await axios.post(backendUrl + "/api/user/admin", {email, password})
           if(response.data.success) {
            setToken(response.data.token)
           }
           else {
            toast.error(response.data.message)
           }
        }
        catch(err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[radial-gradient(circle_at_top,#dbeafe,transparent_45%)] px-4'>
        <div className='bg-white shadow-xl shadow-blue-100/70 border border-slate-100 rounded-2xl px-8 py-8 w-full max-w-md'>
            <p className='text-sm font-bold tracking-[0.18em] text-blue-600 mb-2'>NEXORA</p>
            <h1 className='text-2xl font-bold text-slate-900'>Admin sign in</h1>
            <p className='text-sm text-slate-500 mt-1 mb-6'>Manage electronics, inventory, and orders.</p>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='your@email.com' required className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' />
                </div>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Enter your password' required className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' />
                </div>
                <button type='submit' className='mt-3 w-full py-2.5 px-4 cursor-pointer rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors'>Sign in</button>
            </form>
        </div>
    </div>
  )
}

export default Login
