import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const {token} = req.headers;
    if(!token) {
      return res.json({success:false, message:"Not Authorized to Login"})
    }
  
    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = token_decode.id
      next();
    } 
    catch (err) {
      console.error( err.message);
      res.json({ success: false, message: "Invalid token" });
    }
  };

export default authUser