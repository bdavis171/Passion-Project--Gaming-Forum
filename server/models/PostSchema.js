// post schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Schema
const PostSchema = new Schema(
    {
        title: {type: String,required: true},
        body: {type: String,required: true},
        relatedGame:[{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksGames"}],
        relatedPlatform: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksConsoles"}],
        author: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksUsers"}],
        replies: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksReplies"}],
        dateCreated: {type: Date,default:Date.now}

    }
);

// export model
module.exports = mongoose.model("gaminWorksPosts",PostSchema);