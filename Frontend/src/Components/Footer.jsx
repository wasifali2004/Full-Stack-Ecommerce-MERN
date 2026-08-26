import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'

const Footer = () => {
  return (
    <footer className='mt-24 rounded-t-3xl bg-slate-950 text-slate-300 px-7 sm:px-10'>
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 py-14 text-sm'>
        <div>
          <Brand light />
          <p className='w-full md:w-2/3 text-slate-400 mt-5 leading-6'>Smart electronics, useful gadgets, and reliable accessories—selected to make technology simpler and everyday life better.</p>
        </div>

        <div>
          <p className='text-white font-semibold mb-5'>EXPLORE</p>
          <div className='flex flex-col gap-2 text-slate-400'>
            <Link to='/'>Home</Link>
            <Link to='/collection'>Shop</Link>
            <Link to='/about'>About us</Link>
            <Link to='/contact'>Contact</Link>
          </div>
        </div>

        <div>
          <p className='text-white font-semibold mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-slate-400'>
            <li>+92 111111</li>
            <li>support@nexora.store</li>
          </ul>
        </div>
      </div>

      <div className='border-t border-slate-800'>
        <p className='py-5 text-xs sm:text-sm text-center text-slate-500'>© 2026 Nexora. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
