import userModel from "../models/userModel.js"

const addToCart = async (req,res) => {
    try{
        const {itemId} = req.body;
        const variant = req.body.variant || req.body.size
        const userId = req.userId

        if (!itemId || !variant) {
            return res.status(400).json({success:false, message:"Product and variant are required"})
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        const cartData = structuredClone(userData.cartData || {});

        if(cartData[itemId]) {
            if(cartData[itemId][variant]) {
                cartData[itemId][variant] += 1
            }
            else {
                cartData[itemId][variant] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][variant] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message:"Added To Cart", cartData})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}


const updateCart = async (req,res) => {
    try{
        const {itemId} = req.body;
        const variant = req.body.variant || req.body.size
        const userId = req.userId
        const quantity = Number(req.body.quantity)

        if (!itemId || !variant || !Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({success:false, message:"A valid product, variant and quantity are required"})
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        const cartData = structuredClone(userData.cartData || {});

        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][variant]
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]
                }
            }
        } else {
            cartData[itemId] ??= {}
            cartData[itemId][variant] = quantity;
        }
        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message:"Cart Updated", cartData})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}


const getUserCart = async (req,res) => {
    try{
        const userId = req.userId

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        const cartData = userData.cartData || {};

        res.json({success:true, cartData})

    }
    catch(err) {
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}

export {addToCart, updateCart, getUserCart}
