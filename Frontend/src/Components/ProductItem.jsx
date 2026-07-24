import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext.js'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {
    const {currency} = useContext(ShopContext)
  return ( 
    <article className='group h-full'>
        <Link to={`/product/${id}`} className='text-slate-700 cursor-pointer h-full flex flex-col'>
        <div className='overflow-hidden rounded-2xl bg-slate-100 aspect-square border border-slate-100'>
            <img src={image[0]} alt={name} className='w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out' />
        </div>
        <p className='pt-3 pb-1 text-sm font-medium line-clamp-2'>{name}</p>
        <p className='text-base text-blue-600 font-bold'>{currency}{price}</p>
        </Link>
    </article>
  )
}

export default ProductItem
