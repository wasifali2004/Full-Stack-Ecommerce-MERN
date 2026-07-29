import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    image: {
        type:Array,
        required: true
    },
    category: {
        type:String,
        required: true
    },
    subCategory: {
        type:String,
        required: true
    },
    variants: {
        type:[String],
        required: true,
        default: ['Standard']
    },
    specifications: {
        type: [{ key: String, value: String }],
        default: undefined,
    },
    colors: {
        type: [String],
        default: undefined,
    },
    sizes: {
        type:[String],
        default: undefined
    },
    bestSeller: {
        type:Boolean,
    },
    date: {
        type:Number,
    },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;
