import { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext.js'
import Brand from './Brand.jsx'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
  }

  const navClass = ({isActive}) => `relative py-2 transition hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-slate-600'}`

  return (
    <header className='flex items-center justify-between py-5 font-medium bg-white'>
      <Link to='/' aria-label='Nexora home'><Brand /></Link>

      <nav className='hidden sm:flex items-center gap-7 text-sm'>
        <NavLink to='/' className={navClass}>Home</NavLink>
        <NavLink to='/collection' className={navClass}>Shop</NavLink>
        <NavLink to='/about' className={navClass}>About</NavLink>
        <NavLink to='/contact' className={navClass}>Contact</NavLink>
      </nav>

      <div className='flex items-center gap-5'>
        <button type='button' onClick={() => {setShowSearch(true); navigate('/collection')}} aria-label='Search products'>
          <img src={assets.search_icon} alt='' className='w-5 cursor-pointer' />
        </button>

        <div className='group relative'>
          <button type='button' onClick={() => token ? null : navigate('/login')} aria-label={token ? 'Account menu' : 'Login'}>
            <img src={assets.profile_icon} alt='' className='w-5 cursor-pointer' />
          </button>
          {token &&
            <div className='group-hover:block hidden absolute z-20 dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 py-3 px-4 w-40 bg-white border border-slate-200 shadow-xl text-slate-600 rounded-xl'>
                <button type='button' onClick={() => navigate('/orders')} className='text-left cursor-pointer hover:text-blue-600'>My orders</button>
                <button type='button' onClick={logout} className='text-left cursor-pointer hover:text-blue-600'>Logout</button>
              </div>
            </div>
          }
        </div>

        <Link to='/cart' className='relative' aria-label='Shopping cart'>
          <img src={assets.cart_icon} alt='' className='w-5 min-w-5' />
          <span className='absolute right-[-7px] bottom-[-7px] w-4 text-center leading-4 bg-blue-600 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</span>
        </Link>

        <button type='button' onClick={() => setVisible(true)} className='sm:hidden' aria-label='Open menu'>
          <img src={assets.menu_icon} alt='' className='w-5 cursor-pointer'/>
        </button>
      </div>

      <div className={`fixed z-30 top-0 right-0 bottom-0 overflow-hidden bg-white shadow-2xl transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-slate-700'>
          <button type='button' onClick={() => setVisible(false)} className='flex items-center gap-4 p-5 cursor-pointer border-b'>
            <img src={assets.dropdown_icon} alt='' className='h-4 rotate-180' />
            <span>Back</span>
          </button>
          <NavLink onClick={() => setVisible(false)} to='/' className='py-4 px-6 border-b'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/collection' className='py-4 px-6 border-b'>Shop</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/about' className='py-4 px-6 border-b'>About</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/contact' className='py-4 px-6 border-b'>Contact</NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
