import reviewModel from '../models/review.model.js'
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'

const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body
        const userId = req.userId

        if (!productId || !rating || !comment?.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a product, rating, and comment.' })
        }

        const parsedRating = Number(rating)
        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' })
        }

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' })
        }

        const existingReview = await reviewModel.findOne({ productId, userId })
        if (existingReview) {
            return res.status(409).json({ success: false, message: 'You have already submitted a review for this product.' })
        }

        const review = await reviewModel.create({
            productId,
            userId,
            userName: user.name,
            rating: parsedRating,
            comment: comment.trim(),
            status: 'approved',
        })

        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully and is now live.',
            review,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const listReviews = async (req, res) => {
    try {
        const { productId } = req.query

        const filter = {}
        if (productId) {
            filter.productId = productId
        }

        const reviews = await reviewModel
            .find(filter)
            .sort({ createdAt: -1 })
            .lean()

        return res.json({ success: true, reviews })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const listPendingReviews = async (_req, res) => {
    try {
        const reviews = await reviewModel.find({ status: 'pending' }).sort({ createdAt: -1 }).lean()
        return res.json({ success: true, reviews })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId, status } = req.body

        if (!reviewId || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid review update request.' })
        }

        const review = await reviewModel.findByIdAndUpdate(reviewId, { status }, { new: true })
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found.' })
        }

        return res.json({ success: true, message: 'Review status updated.', review })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export { createReview, listReviews, listPendingReviews, updateReviewStatus }
