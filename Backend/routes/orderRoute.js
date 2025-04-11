import express from 'express'
import {placeOrder, placeOrderStripe, userOrders, updateStatus, allOrders, placeOrderPayoneer, verifyStripe} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router();
//Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

//Payment
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/payoneer',authUser,placeOrderPayoneer)

//User
orderRouter.post('/userorders', authUser,userOrders)

//Verify
orderRouter.post('/verifystripe', authUser,verifyStripe)

export default orderRouter;
