import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

//Global Variables
const currency = 'usd'
const deliveryCharges = 10

//gateway initialize
//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



//placing order with COD Method
const placeOrder = async (req,res) => {
    try{
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId, items, address, amount, paymentMethod: "COD", payment:false, date:Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})
        res.json({success:true, message:"Order Placed"})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message: err.message})
    }
}

//placing order with stripw Method
const placeOrderStripe = async (req,res) => {
    try{
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;

        const orderData = {
            userId, items, address, amount, paymentMethod: "Stripe", payment:false, date:Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) =>({
            price_data:{
                currency:currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data:{
                currency:currency,
                product_data: {
                    name: 'Delivey Charges'
                },
                unit_amount: deliveryCharges*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.session.create({
            success_url: `${origin}/verify?success=true&order_Id=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&order_Id=${newOrder._id}`,
            line_items, mode: 'payment'
        })
        res.json({success:true, session_url:session.url})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message: err.message})
    }
}

//Stripe verification
const verifyStripe = async (req,res) => {
    const {orderId, success, userId} = req.body
    try{
        if(success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success:true})
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } 
    catch(err) {
        console.log(err)
        res.json({success:false, message: err.message})
    }
}



//placing order with Payoneer Method
const placeOrderPayoneer = async (req,res) => {
    try{
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;

        const orderData = {
            userId, items, address, amount, paymentMethod: "payoneer", payment:false, date:Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message: err.message})
    }

}

//All orders data for Admin
const allOrders = async (req,res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}

//User Order Data for Frontend
const userOrders = async (req,res) => {
    try{
        const {userId} = req.body;
        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}

//update order status from Admin
const updateStatus = async (req,res) => {
    try{
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, messages:'Status Updated'})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}

export {placeOrder, placeOrderPayoneer, placeOrderStripe, userOrders, updateStatus, allOrders, verifyStripe};