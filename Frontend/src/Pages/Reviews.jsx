import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Reviews = ({ productId, token, backendUrl, onReviewChange }) => {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/review/list?productId=${productId}`)
      if (response.data.success) {
        const nextReviews = response.data.reviews || []
        setReviews(nextReviews)
        onReviewChange?.(nextReviews)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchReviews()
    }
  }, [productId, backendUrl])

  const submitReview = async (event) => {
    event.preventDefault()
    if (!token) {
      toast.error('Please log in to submit a review.')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment.')
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.post(
        `${backendUrl}/api/review/create`,
        { productId, rating, comment },
        { headers: { token } },
      )

      if (response.data.success) {
        setComment('')
        setRating(5)
        toast.success(response.data.message)
        fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className='flex flex-col gap-6'>
      <div className='rounded-2xl border border-slate-200 bg-slate-50 p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-lg font-semibold text-slate-700'>Customer reviews</p>
            <p className='text-sm text-slate-500'>Reviews count as {reviews.length} and average rating is {averageRating}/5.</p>
          </div>
          <div className='text-sm text-slate-600'>
            <span className='font-semibold text-slate-800'>{averageRating}</span> / 5
          </div>
        </div>
      </div>

      <form onSubmit={submitReview} className='rounded-2xl border border-slate-200 p-5'>
        <div className='mb-3 flex items-center gap-2'>
          <label className='text-sm font-medium text-slate-600'>Your rating</label>
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className='rounded border border-slate-300 px-3 py-2 text-sm'>
            {[5, 4, 3, 2, 1].map((value) => (
              <option value={value} key={value}>{value} star{value > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows='4'
          placeholder='Share your experience with this product...'
          className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
        />
        <button type='submit' disabled={submitting} className='mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'>
          {submitting ? 'Submitting...' : 'Submit review'}
        </button>
      </form>

      <div className='flex flex-col gap-4'>
        {loading ? (
          <p className='text-sm text-slate-500'>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className='rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500'>No reviews yet. Be the first to share your experience.</p>
        ) : (
          reviews.map((item) => (
            <div key={item._id} className='rounded-2xl border border-slate-200 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='font-semibold text-slate-700'>{item.userName}</p>
                  <p className='text-xs text-slate-400'>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className='rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700'>
                  {item.rating}/5
                </div>
              </div>
              <p className='mt-3 text-sm text-slate-600'>{item.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Reviews
