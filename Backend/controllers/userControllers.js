import validator from 'validator';
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const createToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
    );
}

const loginUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false, 
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            const token = createToken(user._id);
            return res.json({
                success: true,
                token,
                user: { 
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
        else {
            res.json({ 
                success: false,
                message: 'Invalid Credentials'
            });
        }
    }
    catch(err) {
        console.error("Login Error:", err);
        return res.status(500).json({ 
            success: false, 
            message: err.message
        });
    }
}


const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const exist = await userModel.findOne({email})
        //Checking User
        if(exist) {
            return res.json({success:false, message: "User already exist"})
        }

        if(!validator.isEmail(email)) {
            return res.json({success:false, message: "Please enter a valid email"})
        }
        if(password.length < 8) {
            return res.json({success:false, message: "Enter a valid password"})
        }
         
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email, 
            password:hashPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        return res.json({success:true, token})
    }
    catch(err) {
        console.log("Error ocurred")
        return res.json({success:false, message:err.message})
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { 
                    id: "admin-id",
                    isAdmin: true 
                },
                process.env.JWT_SECRET,
            );
            res.json({
                success: true,
                token,
                isAdmin: true
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    }
    catch(err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


export {loginUser, adminLogin, registerUser}