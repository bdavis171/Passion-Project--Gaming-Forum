// game schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Game Schema
const GameSchema = new Schema(
    {
        title: {type: String, required: true},
        genre: {type: String,required: true},
        platform: {type: String,required: true},
        developer: {type: String,required: true},
        publisher: {type:String,required: true},
        releasedDate: {type: String,required: true},
        relatedPosts: [{type: mongoose.Schema.Types.ObjectId,ref:""}]
    }
);

// export model
module.exports = mongoose.model("gaminWorksGames",GameSchema);