import React from 'react'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center justify-between py-2 px-[4%]'>
        <img src={assets.logo } className='w-[80px] sm:w-[10%] cursor-pointer' />
        <button onClick={() => setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 cursor-pointer rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar