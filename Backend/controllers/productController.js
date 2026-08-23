import {v2 as cloudinary} from 'cloudinary'
import fs from 'node:fs/promises'
import productModel from '../models/productModel.js';
import reviewModel from '../models/review.model.js';

const extractPublicIdFromUrl = (url) => {
    if (typeof url !== 'string' || !url.includes('/upload/')) return null

    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/)
    return match?.[1] || null
}

const addProduct = async (req,res) => {
    const images = Object.values(req.files || {}).flat()

    try{
        const {name, description, category, subCategory} = req.body;
        const price = Number(req.body.price)
        const bestSeller = req.body.bestSeller === 'true'

        let variants
        try {
            variants = JSON.parse(req.body.variants || req.body.sizes)
        } catch {
            return res.status(400).json({success:false, message:'Product variants are invalid'})
        }

        let specifications = []
        try {
            specifications = JSON.parse(req.body.specifications || '[]')
        } catch {
            return res.status(400).json({success:false, message:'Product specifications are invalid'})
        }
        let colors = []
        try {
            colors = JSON.parse(req.body.colors || '[]')
        } catch {
            return res.status(400).json({success:false, message:'Product colors are invalid'})
        }

        if (!name?.trim() || !description?.trim() || !category || !subCategory) {
            return res.status(400).json({success:false, message:'All product details are required'})
        }
        if (!Number.isFinite(price) || price <= 0) {
            return res.status(400).json({success:false, message:'Enter a valid product price'})
        }
        const normalizedVariants = Array.isArray(variants)
            ? variants.map((variant) => String(variant).trim()).filter(Boolean)
            : []
        const normalizedSpecs = Array.isArray(specifications)
            ? specifications.map((s) => ({ key: String(s.key || '').trim(), value: String(s.value || '').trim() })).filter((s) => s.key)
            : []
        const normalizedColors = Array.isArray(colors) ? colors.map((c) => String(c || '').trim()).filter(Boolean) : []
        if (normalizedVariants.length === 0) {
            return res.status(400).json({success:false, message:'Add at least one product variant'})
        }
        if (images.length === 0) {
            return res.status(400).json({success:false, message:'Upload at least one product image'})
        }

        const [imageUrls, imagePublicIds] = await Promise.all([
            Promise.all(images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })),
            Promise.all(images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.public_id
            }))
        ])

        // generate a short unique product code for admin tracking
        const generateCode = () => {
            const prefix = 'P'
            const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
            return `${prefix}${Date.now().toString(36).toUpperCase()}${rand}`
        }

        const product = new productModel({
            name: name.trim(),
            description: description.trim(),
            category,
            price,
            subCategory,
            bestSeller,
            variants: normalizedVariants,
            specifications: normalizedSpecs,
            colors: normalizedColors,
            image: imageUrls,
            imagePublicIds,
            productCode: generateCode(),
            date: Date.now()
        })

        await product.save();
        res.status(201).json({success:true, message: "Product added"})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success:false, message:err.message})
    }
    finally {
        await Promise.all(images.map((image) => fs.unlink(image.path).catch(() => {})))
    }
}

const listProduct = async (_req,res) => {
    try {
        const products = await productModel.find({}).sort({date: -1});
        res.json({success:true, products})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success: false, message: err.message})
    }
}

const removeProduct = async (req,res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"})
        }

        const publicIds = Array.isArray(product.imagePublicIds) && product.imagePublicIds.length > 0
            ? product.imagePublicIds
            : (Array.isArray(product.image) ? product.image.map(extractPublicIdFromUrl).filter(Boolean) : [])

        const deleteReviews = reviewModel.deleteMany({ productId: product._id }).catch(() => {})
        const deleteImages = Promise.all(
            publicIds.map((publicId) => cloudinary.uploader.destroy(publicId).catch(() => {}))
        )

        await Promise.all([
            productModel.findByIdAndDelete(product._id),
            deleteReviews,
            deleteImages,
        ])

        res.json({success: true, message: "Product removed"})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success: false, message: err.message})
    }
}

const singleProduct = async (req,res) => {
    try{
        const product = await productModel.findById(req.body.productId)
        if (!product) {
            return res.status(404).json({success:false, message:'Product not found'})
        }
        res.json({success:true, product})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success: false, message: err.message})
    }
}

export {addProduct, removeProduct, listProduct, singleProduct}
