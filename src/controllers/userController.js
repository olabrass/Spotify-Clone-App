const asyncHandler = require('express-async-handler');
const {StatusCodes} = require('http-status-codes');
const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');
const generateToken = require('../utils/generateToken');
const {uploadToCloudinary} = require('../utils/cloudinaryUpload');

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
});

//@desc - Get User profile
//@route - GET '/api/users/profile'
//@Access - protected
const getUserProfile = asyncHandler(async(req, res)=>{
    // Find User
    const user = await User.findById(req.user._id).select('-password')
    .populate('likedSongs', 'title artist duration')
    .populate('likedAlbums', 'title artist coverImage')
    .populate('followedArtists', 'name image')
    .populate('followedPlaylists', 'name creator coverImage');
    // Check is user is available
    if(user){
        res.status(StatusCodes.OK).json(user);
    }else{
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not Found');
    }
});

// Update user profile
const updateUserProfile = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user._id);
    const{name, email, password} = req.body;
    if(user){
        user.name = name || user.name;
        user.email = email || user.email;

        // check if password is being updated
    if(password){
        user.password = password;
    }
    // Upload profile picture if provided
    if(req.file){
        const result = await uploadToCloudinary(req.file.path, 'spotify/users');
        user.profilePicture = result.secure_url;
    }
    const updateUser = await user.save();
    res.status(StatusCodes.OK).json({
        _id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        profilePicture:updateUser.profilePicture,
        isAdmin:updateUser.isAdmin
        
    })
    }else{
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User Not Found');
    };
    
});

// Toggle like Song
// Toggle follow artists
// Toggle follow playlist
// Get users



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};