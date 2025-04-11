import userModel from "../models/userModel.js"

const addToCart = async (req,res) => {
    try{
        const {userId, itemId, size} = req.body;
        console.log("Received userId:", userId);
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message:"Added To Cart"})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}


const updateCart = async (req,res) => {
    try{
        const {userId, itemId, size, quantity} = req.body;

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity;
        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message:"Cart Updated"})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}


const getUserCart = async (req,res) => {
    try{
        const {userId} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success:true, cartData})

    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}

export {addToCart, updateCart, getUserCart}
