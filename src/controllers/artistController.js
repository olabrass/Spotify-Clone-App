const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const asyncHandler = require('express-async-handler');
const {StatusCodes} = require('http-status-codes');
const Album = require('../models/Album');
const Song = require('../models/Song');
const {uploadToCloudinary} = require('../utils/cloudinaryUpload');


//@desc - Create a new artist
//@route - POST '/api/artists'
//@Access - protected

const createArtist = asyncHandler(async(req, res)=>{
    // Check for req.body
    if(!req.body){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('Payload is required')
    }

    const {name, bio, genres} =  req.body;
    // Validation
    if(!name || !bio || !genres){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('Name, Bio, and Genres are required');
    }
    // Check if Artist exists
    const existingArtist = await Artist.findOne({name});
    if(existingArtist){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('Artist already exists');
    }
    // Upload artist image if exists
    let imageUrl = "";
    if(req.file){
        const result = uploadToCloudinary(req.file.path, 'spotify/artists');
        imageUrl = (await result).secure_url;
    }
    // Create artist
    const artist = await Artist.create({
        name,
        bio,
        genres,
        isVerified: true,
        image:imageUrl
    })
    res.status(StatusCodes.CREATED).json(artist);
});


//@desc - Get all artist (filter, sort, and search)
//@route - GET /api/artists?genre=Rock&search=pink&page=1&limit=10
//@Access - public
const getArtists = asyncHandler(async(req, res)=>{
    const{genre, name, search, page=1, limit=10} = req.query;
    // Build filter object
    const filter = {};
    if (genre) {
        filter.genres = { $in: [ new RegExp(`^${genre}$`, 'i') ] }; // 'i' = case-insensitive
      }
    if (name) {
        filter.name = { $in: [ new RegExp(`^${name}$`, 'i') ] }; // 'i' = case-insensitive
      }
    if(search){
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { bio: new RegExp(search, 'i') }
        ];
    }
    // Count total artist with filter
    const count = await Artist.countDocuments(filter);
    // Pagination
    const skip = (parseInt(page) -1) * parseInt(limit);
    // Get artist
    const artists = await Artist.find(filter).sort({followers: -1}).limit(parseInt(limit)).skip(skip);

    res.status(StatusCodes.OK).json({
        totalArtist: count<1 ? "No Artist found": count,
        artists,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        
    });

})


//@desc - Get artist by ID
//@route - GET /api/:id
//@Access - public
const getArtist = asyncHandler(async(req, res)=>{
    const artist = await Artist.findById(req.params.id);
    if(!artist){
        res.status(StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(artist);
    
})

module.exports = {
    createArtist,
    getArtists,
    getArtist
};