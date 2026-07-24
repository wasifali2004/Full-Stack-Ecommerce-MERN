const Brand = ({light = false}) => (
  <span className={`inline-flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-[0.18em] ${light ? 'text-white' : 'text-slate-900'}`}>
    NEXORA
    <span className='w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.7)]'></span>
  </span>
)

export default Brand
