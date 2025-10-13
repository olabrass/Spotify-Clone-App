const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');
const artistRouter = require('./routes/artistRoutes');
const { StatusCodes } = require('http-status-codes');

dotenv.config();
const app = express();
app.use(express.json());


mongoose.connect(process.env.DB_URI).then(console.log('Database Connected Successfully')).catch((err)=>{console.log(err.message)});

// Route
app.use('/api/users', userRouter);
app.use('/api/artists', artistRouter);

// Error Handler
app.use((req, res, next)=>{
   const error = new Error("Not Found");
    error.status = StatusCodes.NOT_FOUND;
    next(error);
})

// Global error handler
app.use((error, req, res, next)=>{
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal Server Error",
        status: "Error"
    })
})

// Start the serve
const PORT = process.env.PORT || 5000; 
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));