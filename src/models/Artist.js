const mongoose =require('mongoose');


const artistSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Artist name is required"],
        trim:true
    },

    bio:{
        type:String,
        trim: true
    },

    image:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2020/06/25/17/57/microphone-5340340_640.jpg"
    }, 

    genres:[
        {
        type: String,
        ref:"Song"
        }
         ],

    followers:{
        type:Number,
        default:0
    },
    
    albums:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:Album
        }
    ],

    songs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Song"
        }
    ], 

    isVerifies:{
        type: Boolean,
        default: false
    }
},
{
    timestamps:true
}
);


const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;