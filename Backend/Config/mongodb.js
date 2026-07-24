import mongoose from 'mongoose'

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured')
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || 'e-commerce',
    })

    console.log('DB Connected')
}

export default connectDB;
