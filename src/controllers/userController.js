const asyncHandler = require('express-async-handler');
const {StatusCodes} = require('http-status-codes');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

//@desc - Register new user
//@route - POST '/api/users/register'
//@Access - public

const registerUser = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body;
    // Check if user exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("User already exists")
    }
    // Create new User 
    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        res.status(StatusCodes.CREATED).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture
        })
    }else{
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("No user created"); //Just added
    }
}) 

//@desc - Login a user
//@route - POST '/api/users/login'
//@Access - public
const loginUser = asyncHandler(async(req, res)=>{
   const{email, password} = req.body;
//    check by email if user exists
   const user = await User.findOne({email});
//    The "matchPassword is a method from the MOdel"
   if(user && (await user.matchPassword(password))){
    res.status(StatusCodes.OK).json({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
        token:generateToken(user._id)
    })
   }else{
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Invalid Email or Password")
   }
})

module.exports = {
    registerUser,
    loginUser
};