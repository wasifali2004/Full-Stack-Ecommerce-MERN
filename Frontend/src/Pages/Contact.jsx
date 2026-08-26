import Title from '../Components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t border-slate-200'>
        <Title text1='CONTACT' text2='US' />
      </div>

      <section className='my-10 grid md:grid-cols-2 gap-10 mb-28 items-stretch'>
        <img src={assets.contact_img} alt='Laptop and smartphone on a modern desk' className='w-full h-full max-h-[560px] object-cover rounded-3xl' />
        <div className='flex flex-col justify-center items-start gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12'>
          <p className='text-blue-600 font-semibold tracking-widest text-sm'>WE ARE HERE TO HELP</p>
          <h1 className='text-3xl font-bold text-slate-900'>Product questions or order support?</h1>
          <p className='text-slate-500 leading-7'>Talk to us about device compatibility, available variants, delivery, returns, or choosing the right setup.</p>

          <div className='text-slate-600 leading-7'>
            <p className='font-semibold text-slate-900'>Nexora support</p>
            <p>Sheikh Malton Town, Mardan<br/>KPK, Pakistan</p>
            <p className='mt-3'>Tel: +92 111111<br/>Email: support@nexora.store</p>
          </div>

          <a href='mailto:support@nexora.store' className='bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl text-sm font-semibold transition'>EMAIL SUPPORT</a>
        </div>
      </section>
    </div>
  )
}

export default Contact
