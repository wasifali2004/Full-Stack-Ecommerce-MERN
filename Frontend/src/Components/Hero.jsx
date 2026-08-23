import { Link } from 'react-router-dom'
import {assets} from '../assets/assets'

const Hero = () => {
  return (
    <section className='relative overflow-hidden rounded-3xl bg-slate-950 text-white'>
      <div className='absolute -top-24 -left-24 w-72 h-72 bg-blue-600/30 blur-3xl rounded-full'></div>
      <div className='relative grid sm:grid-cols-2 items-stretch'>
        <div className='flex items-center px-7 py-14 sm:px-10 lg:px-16 lg:py-20'>
          <div className='max-w-xl'>
            <p className='text-blue-300 font-semibold tracking-[0.22em] text-xs sm:text-sm'>NEXT-GEN TECH</p>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-4'>Smart tech.<br/>Better living.</h1>
            <p className='text-slate-300 mt-5 max-w-md'>Discover carefully selected electronics, powerful gadgets, and everyday accessories built to keep you connected.</p>
            <Link to='/collection' className='inline-flex items-center gap-3 mt-8 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition'>
              SHOP THE COLLECTION
              <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
        <div className='min-h-[330px] sm:min-h-[500px]'>
          <img src={assets.hero_img} alt='Modern electronics and smart gadgets' className='w-full h-full object-cover' />
        </div>
      </div>
    </section>
  )
}

export default Hero
