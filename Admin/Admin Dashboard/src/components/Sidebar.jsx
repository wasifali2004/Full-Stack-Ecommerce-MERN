import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='min-h-screen border-r border-slate-200 bg-white w-[20%] min-w-20'>
        <div className='flex flex-col gap-3 pt-6 pl-[14%] text-[15px]'>

        <NavLink to='/add' className='flex items-center gap-3 border border-slate-200 border-r-0 px-3 py-3 rounded-l-xl'>
        <img src={assets.add_icon } alt="" className='w-5 h-5' />
        <p className='hidden md:block'>Add Product</p>
        </NavLink>

        <NavLink to='/list' className='flex items-center gap-3 border border-slate-200 border-r-0 px-3 py-3 rounded-l-xl'>
        <img src={assets.order_icon} alt="" className='w-5 h-5' />
        <p className='hidden md:block'>Products</p>
        </NavLink>

        <NavLink to='/orders' className='flex items-center gap-3 border border-slate-200 border-r-0 px-3 py-3 rounded-l-xl'>
        <img src={assets.order_icon} alt="" className='w-5 h-5' />
        <p className='hidden md:block'>Orders</p>
        </NavLink>

        </div>
    </div>
  )
}

export default Sidebar
