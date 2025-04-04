const jwt = require('jsonwebtoken');

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        // Check if dToken header exists (case-insensitive)
        const authHeader = req.headers.dtoken || req.headers.dToken;
        
        if (!authHeader) {
            return res.json({success: false, message: 'Not authorized, please login again'});
        }
        
        // Extract the token part from Bearer token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.json({success: false, message: 'Not authorized, please login again'});
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.docId = token_decode.id;
        
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

module.exports = authDoctor;