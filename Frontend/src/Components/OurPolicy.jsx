import { assets } from '../assets/assets'

const OurPolicy = () => {
  const policies = [
    {icon: assets.exchange_icon, title: 'Easy 7-day returns', text: 'Straightforward returns on eligible gadgets and accessories.'},
    {icon: assets.quality_icon, title: 'Quality checked', text: 'Products are selected from trusted suppliers and carefully reviewed.'},
    {icon: assets.support_img, title: 'Helpful tech support', text: 'Get guidance before your purchase and support after delivery.'},
  ]

  return (
    <section className='grid sm:grid-cols-3 gap-5 py-16'>
      {policies.map((policy) => (
        <div key={policy.title} className='rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm'>
          <img src={policy.icon} alt='' className='w-10 m-auto mb-4' />
          <p className='font-semibold text-slate-800'>{policy.title}</p>
          <p className='text-slate-500 text-sm mt-2'>{policy.text}</p>
        </div>
      ))}
    </section>
  )
}

export default OurPolicy
