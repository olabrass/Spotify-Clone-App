const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');


// Middleware to protect route - Check JWT token and set re.user
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Find user
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(StatusCodes.UNAUTHORIZED);
                throw new Error('User no longer exists');
            }

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.UNAUTHORIZED);
            throw new Error('Not authorized, token failed or expired');
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error('No token provided, please login');
    }
});


// check if a user is an admin
const isAdmin = asyncHandler(async(req, res, next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(StatusCodes.FORBIDDEN);
        throw new Error('Access denied, you are not an admin');
    }
})

module.exports ={ 
    protect,
    isAdmin
}