const NewsletterBox = () => {
  const onSubmitHandler = (event) => event.preventDefault()

  return (
    <section className='text-center rounded-3xl bg-blue-50 border border-blue-100 px-5 py-12'>
      <p className='text-2xl sm:text-3xl font-bold text-slate-900'>Stay ahead of the next upgrade</p>
      <p className='text-slate-500 mt-3'>Get new-product alerts, useful buying guides, and member-only technology deals.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-2/3 max-w-xl flex items-center mx-auto mt-7 bg-white border border-slate-200 rounded-xl overflow-hidden'>
        <input type='email' placeholder='Enter your email address' aria-label='Email address' className='w-full flex-1 outline-none px-4 py-3' required />
        <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 sm:px-10 py-4 transition'>SUBSCRIBE</button>
      </form>
    </section>
  )
}

export default NewsletterBox