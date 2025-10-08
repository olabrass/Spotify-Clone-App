const cloudinary = require('../config/cloudinary');
const fs =  require('fs');


const uploadToCloudinary = async(filePath, folder)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto', //Accepts any type of file
    });
    // Delete the local file in the uploads folder after uploading to cloudinary
    fs.unlinkSync(filePath);
    return result;
    }catch(error){
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        throw new Error(`Failed to upload to cloudinary', ${error.message}`);

    }
};

module.exports = {
    uploadToCloudinary
};