const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const protect=asyncHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try {
            token=req.headers.authorization.split('Bearer ')[1];
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select("-password");

            next()

        }catch(err){
            console.log(err);
            res.status(401).json({message:"You are not authorized"});
        }

    }

    if(!token){
        res.status(401).json({message:"You are not authorized, not token"});
    }
})

module.exports=protect;