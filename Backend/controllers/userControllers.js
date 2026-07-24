import validator from 'validator';
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        
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
            return res.status(401).json({
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
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const {password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({success:false, message: "Name, email and password are required"})
        }

        const exist = await userModel.findOne({email})
        //Checking User
        if(exist) {
            return res.status(409).json({success:false, message: "User already exists"})
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({success:false, message: "Please enter a valid email"})
        }
        if(password.length < 8) {
            return res.status(400).json({success:false, message: "Password must contain at least 8 characters"})
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
        return res.status(500).json({success:false, message:err.message})
    }
}

const adminLogin = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const { password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { id: "admin-id", isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: '12h' },
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
