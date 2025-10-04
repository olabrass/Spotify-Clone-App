const express = require('express');
const userController = require('../controllers/userController');
const {protect} = require('../middlewares/auth');
const userRouter = express.Router();



userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/profile', protect, userController.getUserProfile);
 
module.exports = userRouter;