import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../Components/NewsletterBox'

const About = () => {
  const reasons = [
    {title: 'Products that make sense', text: 'We focus on useful technology with clear specifications, dependable performance, and strong everyday value.'},
    {title: 'Simple buying decisions', text: 'Straightforward categories and product configurations help you compare devices without unnecessary complexity.'},
    {title: 'Support beyond checkout', text: 'Our team is ready to help with product questions, compatibility, delivery, returns, and after-sales guidance.'},
  ]

  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t border-slate-200'>
        <Title text1='ABOUT' text2='NEXORA' />
      </div>

      <section className='my-10 grid md:grid-cols-2 gap-12 lg:gap-16 items-center'>
        <img src={assets.about_img} alt='A modern workspace with useful electronics and accessories' className='w-full rounded-3xl' />
        <div className='flex flex-col gap-6 text-slate-600 leading-7'>
          <p className='text-blue-600 font-semibold tracking-widest text-sm'>TECHNOLOGY FOR REAL LIFE</p>
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 leading-tight'>The right gadget should make your day easier.</h1>
          <p>Nexora brings together practical electronics, smart devices, audio gear, computing essentials, and accessories for work, entertainment, and connected living.</p>
          <p>We care about clear information, genuine value, secure shopping, and dependable support—so you can choose technology with confidence.</p>
          <div>
            <p className='font-semibold text-slate-900'>Our mission</p>
            <p className='mt-2'>Make reliable technology easier to discover, understand, and own.</p>
          </div>
        </div>
      </section>

      <div className='text-xl py-5'>
        <Title text1='WHY' text2='CHOOSE US' />
      </div>

      <section className='grid md:grid-cols-3 gap-5 mb-20'>
        {reasons.map((reason, index) => (
          <div key={reason.title} className='border border-slate-200 rounded-2xl px-7 py-9 bg-white shadow-sm'>
            <span className='inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold'>0{index + 1}</span>
            <h2 className='font-semibold text-slate-900 mt-5'>{reason.title}</h2>
            <p className='text-slate-500 text-sm leading-6 mt-3'>{reason.text}</p>
          </div>
        ))}
      </section>

      <NewsletterBox />
    </div>
  )
}

export default About
