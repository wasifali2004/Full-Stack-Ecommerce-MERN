import { useContext, useEffect, useMemo, useState } from 'react'
import {ShopContext} from '../Context/ShopContext.js'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedProduct from '../Components/RelatedProduct'
import Reviews from './Reviews'

const Product = () => {
  const {products, currency, addToCart, token, backendUrl} = useContext(ShopContext)
  const {productId} = useParams()
  const productData = useMemo(
    () => products.find((item) => item._id === productId),
    [productId, products],
  )
  const [image, setImage] = useState('')
  const [variant, setVariant] = useState('')
  const [reviewSummary, setReviewSummary] = useState({ count: 0, average: 0 })

  useEffect(() => {
    setImage(productData?.image[0] || '')
    setVariant('')
  }, [productData])

  const handleReviewChange = (reviews = []) => {
    if (!reviews.length) {
      setReviewSummary({ count: 0, average: 0 })
      return
    }

    const count = reviews.length
    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / count
    setReviewSummary({ count, average })
  }

  if (!productData) {
    return <div className='border-t py-20 text-center text-gray-500'>Product not found.</div>
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[90px] w-full'>
            {productData.image.map((item) => (
              <button type='button' key={item} onClick={() => setImage(item)} className='w-[24%] sm:w-full mb-3 flex-shrink-0 cursor-pointer'>
                <img src={item} alt={`${productData.name} preview`} className='w-full' />
              </button>
            ))}
          </div>
          <div className='w-full sm:w-[392px]'>
            <img src={image} alt={productData.name} className='w-full h-auto' />
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <img key={star} src={star <= Math.round(reviewSummary.average || 0) ? assets.star_icon : assets.star_dull_icon} alt='' className='w-3.5' />
            ))}
            <p className='pl-2'>({reviewSummary.count} {reviewSummary.count === 1 ? 'review' : 'reviews'})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          {/* <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p> */}
          <div className='flex flex-col gap-2 mt-8'>
            <p className='font-medium'>Choose a variant</p>
            <div className='flex flex-wrap gap-2'>
              {(productData.variants?.length ? productData.variants : productData.sizes || ['Standard']).map((item) => (
                <button type='button' onClick={() => setVariant(item)} key={item} className={`border rounded-lg cursor-pointer py-2 px-4 bg-slate-50 transition ${item === variant ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}>{item}</button>
              ))}
            </div>
          </div>
          <button type='button' onClick={() => addToCart(productData._id, variant)} className='bg-blue-600 hover:bg-blue-700 rounded-lg mt-10 text-white px-8 py-3 text-sm active:bg-blue-800 cursor-pointer transition'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 opacity-14' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>Authentic products from trusted suppliers.</p>
            <p>Cash on delivery is available on eligible orders.</p>
            <p>Easy 7-day returns with responsive technical support.</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex flex-wrap'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          {/* <p className='border px-5 py-3 text-sm'>Reviews</p> */}
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
        <div className='mt-6'>
          <Reviews productId={productData._id} token={token} backendUrl={backendUrl} onReviewChange={handleReviewChange} />
        </div>
      </div>

      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  )
}

export default Product
