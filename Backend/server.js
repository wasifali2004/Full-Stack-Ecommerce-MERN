import express from 'express'
import cors from 'cors'
import connectDB from './Config/mongodb.js';
import connectCloudinary from './Config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import noteRoute from './routes/noteRoute.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
        : true,
}))
app.use('/api/user', userRouter)
app.use('/api/product', productRoute)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review', reviewRoute)
app.use('/api/note', noteRoute)

connectCloudinary();

app.get('/', (req, res) => {
    res.send("API Working")
})

const startServer = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured')
        }
        await connectDB()
        await new Promise((resolve, reject) => {
            const server = app.listen(port)
            server.once('listening', () => {
                console.log(`Server is running on http://localhost:${port}`)
                resolve()
            })
            server.once('error', reject)
        })
    } catch (error) {
        if (error.code === 'EADDRINUSE') {
            console.error(`Unable to start server: port ${port} is already in use. Stop the existing API process or use a different PORT.`)
        } else {
            console.error(`Unable to start server: ${error.message}`)
        }
        process.exit(1)
    }
}

if (process.env.VERCEL) {
    connectDB().catch((error) => console.error(`Database connection failed: ${error.message}`))
} else {
    startServer()
}

export default app
