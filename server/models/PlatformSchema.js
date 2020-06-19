// platform schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Platform Schema
const PlatformSchema = new Schema(
    {
        name: {type: String, required: true},
        genre: {type: String,required: true},
        platform: {type: String,required: true},
        developer: {type: String,required: true},
        publisher: {type:String,required: true},
        releasedDate: {type: String,required: true},
        relatedPosts: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksPosts"}]
    }
);

// export model
module.exports = mongoose.model("gaminWorksConsoles",PlatformSchema);