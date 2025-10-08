const multer = require('multer');
const path =  require('path');


// Configure storage for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
       cb(
         null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
       );
    },
});

// File filter - only allow audio and image
const fileFilter = (req, file, cb)=>{
    // Accept audio files(mp3, wav)
    if(file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav'){
        cb(null, true);
    }
    // Accept images(jpeg, png, jpg)
    else if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(new Error('Unsupported format, only audio or image file is allowed', false))
    }
}

const upload = multer({
    storage: storage,
    limits: {fieldSize: 10 * 1024 * 1024}, //Maximum upload of 10MB file size
    fileFilter:fileFilter
});

module.exports = upload;