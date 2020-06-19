// reply schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reply Schema
const ReplySchema = new Schema(
    {
        author: String,
        authorEmail: String,
        body: {type:String,required:true},
        dateCreated: {type: Date, default:Date.now},
        relatedPost: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksPosts"}]
    }
);

// export model
module.exports = mongoose.model("gaminWorksReplies",ReplySchema);