import express from 'express'
import authUser from '../middleware/auth.js'
import { createReview, listPendingReviews, listReviews, updateReviewStatus } from '../controllers/reviews.controller.js'

const reviewRoute = express.Router()

reviewRoute.post('/create', authUser, createReview)
reviewRoute.get('/list', listReviews)
reviewRoute.get('/pending', authUser, listPendingReviews)
reviewRoute.post('/status', authUser, updateReviewStatus)

export default reviewRoute
