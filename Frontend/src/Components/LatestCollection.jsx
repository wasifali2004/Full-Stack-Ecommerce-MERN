import { useContext, useMemo } from 'react'
import { ShopContext } from '../Context/ShopContext.js'
import Title from './Title.jsx'
import ProductItem from './ProductItem.jsx'

const LatestCollection = () => {
  const {products} = useContext(ShopContext)
  const latestProducts = useMemo(() => products.slice(0, 10), [products])

  return (
    <section className='my-14'>
      <div className='text-center py-8 text-3xl'>
        <Title text1='NEW' text2='ARRIVALS'/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-slate-500'>Explore the latest laptops, smart devices, audio gear, and accessories selected for performance, value, and everyday reliability.</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8'>
        {latestProducts.map((item) => (
          <ProductItem key={item._id} id={item._id} image={item.image} price={item.price} name={item.name}/>
        ))}
      </div>
    </section>
  )
}

export default LatestCollection
