import React, { useEffect } from 'react'
import { Navigate, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token') : '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
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
          <Route path='/' element={<Navigate to='/add' replace />} />
          <Route path='/add' element={<Add token={token}/>} />
          <Route path='/list' element={<List token={token}/>} />
          <Route path='/orders' element={<Orders token={token}/>} />
          <Route path='*' element={<Navigate to='/add' replace />} />
        </Routes>
        </div>
      </div>
      </>
      }
    </div>
  )
}

export default App
