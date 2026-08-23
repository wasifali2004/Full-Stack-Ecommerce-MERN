const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center justify-between py-4 px-[4%] bg-white'>
        <div className='flex items-center gap-3'>
          <span className='inline-flex items-center text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900'>
            NEXORA<span className='ml-1 size-2 rounded-full bg-blue-600 shadow-[0_0_12px_#2563eb]'></span>
          </span>
          <span className='hidden sm:inline-block border-l border-slate-300 pl-3 text-xs font-semibold tracking-[0.14em] text-slate-500'>ADMIN</span>
        </div>
        <button type='button' onClick={() => setToken('')} className='bg-slate-900 hover:bg-blue-600 text-white px-5 py-2 sm:px-7 cursor-pointer rounded-full text-xs sm:text-sm transition-colors'>Logout</button>
    </div>
  )
}

export default Navbar
