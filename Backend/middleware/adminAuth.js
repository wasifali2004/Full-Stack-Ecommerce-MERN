import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode?.isAdmin) {
            return res.status(403).json({ success: false, message: "Not Authorized, login again" });
        }

        req.admin = tokenDecode;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ success: false, message: err.message });
    }
};

export default adminAuth;
