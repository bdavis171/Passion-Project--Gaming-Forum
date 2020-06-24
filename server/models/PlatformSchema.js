// platform schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Platform Schema
const PlatformSchema = new Schema(
    {
        name: {type: String, required: true},
        maker: {type: String,required: true},
        releaseDate: {type: String,required: true},
        relatedPosts: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksPosts"}],
        games:[{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksGames"}]
    }
);

// export model
module.exports = mongoose.model("gaminWorksConsoles",PlatformSchema);