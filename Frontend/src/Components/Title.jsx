const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
        <p className='text-slate-400'>{text1} <span className='text-slate-800 font-semibold'>{text2}</span> </p>
        <span className='w-8 sm:w-12 h-[2px] bg-blue-600 rounded-full'></span>
    </div>
  )
}

export default Title
