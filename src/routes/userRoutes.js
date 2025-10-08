const express = require('express');
const userController = require('../controllers/userController');
const {protect} = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userRouter = express.Router();


// Public Routes
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
// Private Routes
userRouter.get('/profile', protect, userController.getUserProfile);
userRouter.put('/profile/', protect, upload.single('profilePicture'), userController.updateUserProfile);
 
module.exports = userRouter;