import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const authorization = req.headers.authorization
    const token = req.headers.token || (authorization?.startsWith('Bearer ') ? authorization.slice(7) : '')

    if(!token) {
      return res.status(401).json({success:false, message:"Not authorized. Please log in again."})
    }
  
    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = token_decode.id
      next();
    } 
    catch {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };

export default authUser
