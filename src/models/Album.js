const mongoose =require('mongoose');


const albumSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, "Title is required"],
        trim:true
    },

    artist:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, "Artist is required"],
        ref: Artist
    },

    releasedDate:{
        type: Date,
        default: Date.now()
    },

    coverImage:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/11/23/00/58/record-player-1851576_640.jpg"
    }, 

    songs:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Song"
        }
         ],

    genre:{
        type:String,
        trim: true
    },

    likes:{
        type: Number,
        default:0
    },
    description:{
        type:String,
        trim:true
    },
    
    isExplicit:{
        type: Boolean,
        default:false
    }
  
},
{
    timestamps:true
}
);


const Album = mongoose.model("Album", albumSchema);
module.exports = Album;