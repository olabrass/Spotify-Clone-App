const mongoose =require('mongoose');


const playlistSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Playlist name is required"],
        trim:true
    },

    description:{
        type: String,
        trim:true
    },

    coverImage:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2020/06/25/17/57/microphone-5340340_640.jpg"
    }, 

    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Creator is required"]
    },
    
    songs:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song",
    }
    ],

   isPublic:{
        type:Boolean,
        default:false
    },

    followers:{
        type:Number,
        default:0
    },

    collaborators:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps:true
}
);


const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;