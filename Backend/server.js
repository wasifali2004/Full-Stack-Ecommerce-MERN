import express from 'express'
import cors from 'cors'
import connectDB from './Config/mongodb.js';
import connectCloudinary from './Config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/product', productRoute)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

connectDB()
connectCloudinary();

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log("Server is Running on PORT:" + port))