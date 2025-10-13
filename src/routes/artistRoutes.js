const express = require('express');
const artistController = require('../controllers/artistController');
const artistRouter = express.Router();
const {protect, isAdmin} = require('../middlewares/auth');
const upload = require('../middlewares/upload');

artistRouter.post('/', protect, isAdmin, upload.single('image'), artistController.createArtist);
artistRouter.get('/', artistController.getArtists);
artistRouter.get('/:id', artistController.getArtist);


module.exports = artistRouter;

