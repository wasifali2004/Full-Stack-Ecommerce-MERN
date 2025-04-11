import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers

        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", token_decode);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ) {
            return res.json({ success: false, message: "Not Authorized, login again" });
        }

        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.json({ success: false, message: err.message });
    }
};

export default adminAuth;
