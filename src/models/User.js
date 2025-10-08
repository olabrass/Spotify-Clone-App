const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Name is required"],
        trim:true
    },

    email:{
        type:String,
        required:[true, "Email is required"],
        trim:true
    },

    password:{
        type: String,
        required:[true, "Password is required"],
        minlength:[6, "Password must be at least 6 characters"]
    },

    profilePicture:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2025/08/28/11/47/user-9801869_640.png"
    }, 

    isAdmin:{
        type: String,
        default: false
    },

    likedSongs:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }
    ],

    likedAlbums:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Album"
    }
        ],

    followedArtists:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Artist"
    }
    ],

    followedPlaylists:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Playlist"
    }
    ]
},
{
    timestamps:true
}
);

// Pre Hook for hashing password
// Hash password before saving
userSchema.pre('save', async function(next){
    // only hash password if it is modified
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
});

// Method to compare incoming password with the hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
 
 
const User = mongoose.model("User", userSchema);
module.exports = User;