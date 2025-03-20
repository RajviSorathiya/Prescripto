const jwt = require('jsonwebtoken');

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        
        const token =req.headers.authorization.split(' ')[1]
        console.log(token)
        if(!token){
            return res.json({success:false,message:'not authorized login agian'})
        }
        const token_decode =jwt.verify(token,process.env.JWT_SECRET)
        console.log(token_decode,token_decode.id)
        req.body.userId= token_decode.id
        
        next()
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }
    
}    

module.exports=authUser