// users schema

// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema(
    {
        name: {type: String,required: true},
        email: {type:String,required: true},
        password: {type:String,required: true},
        bio: {type:String,default:"We don't know anything about you. You could tell us here."},
        profileImg: {type:String,default:"/kemptons-blank-profile-picture.jpg"},
        gamesOwned: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksGames"}],
        posts: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksPosts"}],
        replies: [{type: mongoose.Schema.Types.ObjectId,ref:"gaminWorksReplies"}],
        signature: {type:String,default:"You don't have a signature. You can put whatever you want here."},
        role: {type:String,required:true}

    },
    {timestamps:true}
);

// export model
module.exports = mongoose.model("gaminWorksUsers",UserSchema);