import React, { useEffect } from 'react'
import { Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === "" ? <Login setToken={setToken} /> :
      <>
      <Navbar setToken={setToken} />
      <hr  className='border border-gray-300'/>
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[70%] mx-auto ml-[5vw] md:ml-[25px] my-8 text-gray-600 text-base'>
        <Routes>
          <Route path='/add' element={<Add token={token}/>} />
          <Route path='/list' element={<List token={token}/>} />
          <Route path='/orders' element={<Orders token={token}/>} />
        </Routes>
        </div>
      </div>
      </>
      }
    </div>
  )
}

export default App