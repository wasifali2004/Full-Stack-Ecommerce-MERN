import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title.jsx'
import ProductItems from './ProductItem.jsx'
import { useState } from 'react'

const LatestCollection = () => {
    const {products} = useContext(ShopContext);
    const [latestProduct, setLatestProduct] = useState([])

    useEffect(() => {
        setLatestProduct(products.slice(0,10))
    },[products])

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'}  text2={'COLLECTIONS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>New season, new styles! We’ve curated an exclusive collection of trendy and stylish pieces that make you stand out effortlessly. Don’t miss out—shop the latest fashion now!</p>
        </div>

        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
         {
          latestProduct.map((item, index) => (
            <ProductItems key={index} id={item._id} image={item.image} price={item.price} name={item.name}/>
          ))
         }
        </div>
    </div>
  )
}

export default LatestCollection