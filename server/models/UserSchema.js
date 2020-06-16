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
        bio: String,
        profileImg: String,
        gamesOwned: Array,
        platformsOwned: Array,
        posts: [{type: mongoose.Schema.Types.ObjectId,ref:""}],
        replies: [{type: mongoose.Schema.Types.ObjectId,ref:""}],
        signature: String,
        role: {type:String,required:true}

    },
    {timestamps:true}
);

// export model
module.exports = mongoose.model("gaminWorksUsers",UserSchema);