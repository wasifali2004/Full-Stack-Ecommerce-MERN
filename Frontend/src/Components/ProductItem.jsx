import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../Context/ShopContext.js'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {
    const {currency, backendUrl} = useContext(ShopContext)
    const [rating, setRating] = useState(null)
    const [reviewCount, setReviewCount] = useState(0)

    useEffect(() => {
        let isActive = true

        const fetchRating = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/review/list?productId=${id}`)
                if (isActive && response.data.success) {
                    const reviews = response.data.reviews || []
                    if (reviews.length > 0) {
                        const average = reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length
                        setRating(Number(average.toFixed(1)))
                        setReviewCount(reviews.length)
                    } else {
                        setRating(null)
                        setReviewCount(0)
                    }
                }
            } catch {
                if (isActive) {
                    setRating(null)
                    setReviewCount(0)
                }
            }
        }

        if (id) {
            fetchRating()
        }

        return () => {
            isActive = false
        }
    }, [backendUrl, id])

  return ( 
    <article className='group h-full'>
        <Link to={`/product/${id}`} className='text-slate-700 cursor-pointer h-full flex flex-col'>
        <div className='overflow-hidden rounded-2xl bg-slate-100 aspect-square border border-slate-100'>
            <img src={image[0]} alt={name} className='w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out' />
        </div>
        <p className='pt-3 pb-1 text-sm font-medium line-clamp-2'>{name}</p>
        <div className='flex items-center gap-1 text-sm'>
            <span className='text-amber-500'>★</span>
            <span className={rating ? 'text-slate-700' : 'text-slate-400'}>
                {rating ? `${rating.toFixed(1)}/5` : 'No ratings yet'}
            </span>
            {reviewCount > 0 && (
                <span className='text-slate-500'>({reviewCount})</span>
            )}
        </div>
        <p className='text-base text-blue-600 font-bold'>{currency}{price}</p>
        </Link>
    </article>
  )
}

export default ProductItem
