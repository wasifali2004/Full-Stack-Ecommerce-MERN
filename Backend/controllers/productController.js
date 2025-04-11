import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js';

const addProduct = async (req,res) => {
    try{
        const {name, description, price, category, subCategory, sizes, bestSeller} = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        console.log(name,description,price,category,subCategory,sizes,bestSeller)

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        console.log(images)

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save();
        res.json({success:true, message: "Product Added  "})
    }
    catch(err) {
        console.log(err)
        res.json({success:false, message:err.message})
    }
}

const listProduct = async (req,res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    }
    catch(err) {
        console.log(err)
        res.json({success: true, message: err.message})
    }
}

const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Product Removed"})
    }
    catch(err) {
        console.log(err)
        res.json({success: true, message: err.message})
    }
}

const singleProduct = async (req,res) => {
    try{
        const {productId} = req.body;
        const product = await productModel.findByI(productId)
        res.json({success:true, product})
    }
    catch(err) {
        console.log(err)
        res.json({success: true, message: err.message})
    }
    
}

export {addProduct, removeProduct, listProduct, singleProduct}