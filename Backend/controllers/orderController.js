import Stripe from 'stripe'
import orderModel from "../models/orderModel.js";
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'

const currency = 'usd'
const deliveryCharges = 10
const validStatuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const buildOrder = async (requestedItems) => {
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
        throw new Error('Your cart is empty')
    }

    const productIds = [...new Set(requestedItems.map((item) => item._id))]
    const products = await productModel.find({_id: {$in: productIds}})
    const productsById = new Map(products.map((product) => [product._id.toString(), product]))
    let subtotal = 0

    const items = requestedItems.map((requestedItem) => {
        const product = productsById.get(requestedItem._id)
        const quantity = Number(requestedItem.quantity)
        const variant = requestedItem.variant || requestedItem.size
        const color = requestedItem.color
        const productVariants = product?.variants?.length ? product.variants : product?.sizes

        if (!product || !Number.isInteger(quantity) || quantity < 1 || !productVariants?.includes(variant)) {
            throw new Error('One or more cart items are invalid')
        }

        if (color && Array.isArray(product.colors) && product.colors.length > 0 && !product.colors.includes(color)) {
            throw new Error('Selected color is not available for one or more items')
        }

        subtotal += product.price * quantity
        return {
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            subCategory: product.subCategory,
            variant,
            color,
            productCode: product.productCode,
            quantity,
        }
    })

    return {items, amount: subtotal + deliveryCharges}
}

const validateAddress = (address) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
    return address && requiredFields.every((field) => String(address[field] || '').trim())
}

const placeOrder = async (req,res) => {
    try{
        if (!validateAddress(req.body.address)) {
            return res.status(400).json({success:false, message:'Complete all delivery information'})
        }

        const {items, amount} = await buildOrder(req.body.items)
        await orderModel.create({
            userId: req.userId,
            items,
            address: req.body.address,
            amount,
            paymentMethod: "COD",
            payment:false,
            date:Date.now()
        })

        await userModel.findByIdAndUpdate(req.userId, {cartData: {}})
        res.status(201).json({success:true, message:"Order placed"})
    }
    catch(err) {
        console.error(err)
        res.status(400).json({success:false, message: err.message})
    }
}

const placeOrderStripe = async (req,res) => {
    let newOrder

    try{
        const stripe = getStripe()
        if (!stripe) {
            return res.status(503).json({success:false, message:'Stripe is not configured'})
        }
        if (!validateAddress(req.body.address)) {
            return res.status(400).json({success:false, message:'Complete all delivery information'})
        }

        const {items, amount} = await buildOrder(req.body.items)
        newOrder = await orderModel.create({
            userId: req.userId,
            items,
            address: req.body.address,
            amount,
            paymentMethod: "Stripe",
            payment:false,
            date:Date.now()
        })

        const clientOrigin = process.env.CLIENT_URL || req.headers.origin
        if (!clientOrigin) {
            throw new Error('Client URL is not configured')
        }

        const lineItems = items.map((item) =>({
            price_data:{
                currency,
                product_data: {name: item.name},
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }))

        lineItems.push({
            price_data:{
                currency,
                product_data: {name: 'Delivery charges'},
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${clientOrigin}/verify?success=true&orderId=${newOrder._id}&sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientOrigin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: lineItems,
            mode: 'payment',
            customer_email: req.body.address.email,
            metadata: {
                orderId: newOrder._id.toString(),
                userId: req.userId,
            },
        })

        newOrder.stripeSessionId = session.id
        await newOrder.save()
        res.status(201).json({success:true, session_url:session.url})
    }
    catch(err) {
        if (newOrder?._id) {
            await orderModel.findByIdAndDelete(newOrder._id)
        }
        console.error(err)
        res.status(400).json({success:false, message: err.message})
    }
}

const verifyStripe = async (req,res) => {
    const {orderId, sessionId, success} = req.body

    try{
        const order = await orderModel.findOne({_id: orderId, userId: req.userId})
        if (!order) {
            return res.status(404).json({success:false, message:'Order not found'})
        }

        if(success !== 'true') {
            if (!order.payment) {
                await order.deleteOne()
            }
            return res.json({success:false, message:'Payment was cancelled'})
        }

        const stripe = getStripe()
        if (!stripe || !sessionId || order.stripeSessionId !== sessionId) {
            return res.status(400).json({success:false, message:'Unable to verify payment'})
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        const validSession = session.payment_status === 'paid'
            && session.metadata?.orderId === orderId
            && session.metadata?.userId === req.userId

        if (!validSession) {
            return res.status(400).json({success:false, message:'Payment has not been completed'})
        }

        order.payment = true
        await order.save()
        await userModel.findByIdAndUpdate(req.userId, {cartData: {}})
        res.json({success:true})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success:false, message: err.message})
    }
}

const allOrders = async (_req,res) => {
    try{
        const orders = await orderModel.find({}).sort({date: -1})
        const userIds = [...new Set(orders.map((order) => order.userId).filter(Boolean))]
        const users = await userModel.find({ _id: { $in: userIds } })
        const userMap = new Map(
            users.map((user) => [user._id.toString(), {
                _id: user._id,
                name: user.name,
                email: user.email,
                customerId: user.customerId || user._id.toString()
            }])
        )

        const ordersWithUser = orders.map((order) => ({
            ...order.toObject(),
            user: userMap.get(order.userId?.toString()) || null
        }))

        res.json({success:true, orders: ordersWithUser})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success:false, message:err.message})
    }
}

const userOrders = async (req,res) => {
    try{
        const orders = await orderModel.find({userId: req.userId}).sort({date: -1})
        res.json({success:true, orders})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success:false, message:err.message})
    }
}

const updateStatus = async (req,res) => {
    try{
        const {orderId, status} = req.body;
        if (!validStatuses.includes(status)) {
            return res.status(400).json({success:false, message:'Invalid order status'})
        }

        const order = await orderModel.findByIdAndUpdate(orderId, {status})
        if (!order) {
            return res.status(404).json({success:false, message:'Order not found'})
        }
        res.json({success:true, message:'Status updated'})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success:false, message:err.message})
    }
}

export {placeOrder, placeOrderStripe, userOrders, updateStatus, allOrders, verifyStripe};
