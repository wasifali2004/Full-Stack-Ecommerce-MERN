import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        const token = req.headers.token || (authorization?.startsWith('Bearer ') ? authorization.slice(7) : '')

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.isAdmin !== true) {
            return res.status(403).json({ success: false, message: "Administrator access required" });
        }

        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default adminAuth;
