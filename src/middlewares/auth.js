const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');


// Middleware to protect route - Check JWT token and set re.user
const protect = asyncHandler(async(req, res, next)=>{
    let token;
    // Check if token exists in the header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get the token from the header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(decoded);
            // set req.user to the user found in the token
            req.user = await User.findById(decoded.id).select('-password');
            next();

        }catch(error){
            console.log(error);
            res.status(StatusCodes.UNAUTHORIZED);
            throw new Error('Not Authorized, Please Login');
        }
    }else{
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User Not Found');
    }
});

module.exports ={ 
    protect,
}