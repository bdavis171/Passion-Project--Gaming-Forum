// api routes

// import express
const express = require('express');
const router = express.Router();
router.use(express.json()); // json middleware

// import authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../config/keys').secretOrKey;

// import schemas
const GameCollection = require('../models/GameSchema');
const UserCollection = require('../models/UserSchema');
const PostCollection = require('../models/PostSchema');


///////////////////////////////////////////////////////////////
//
//                 Game Routes
//
//////////////////////////////////////////////////////////////

// POST: add a new game
router.post("/games",(req,res)=> {
    // res.send("new game added");
    GameCollection.create(req.body,(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// GET: view all games
router.get("/games",(req,res) => {
    // res.send("all games viewed")
    GameCollection.find((errors,results) => {
        errors ? res.send(errors):res.send(results);
    }).populate("relatedPosts");
});

// GET: view one game by id
router.get("/games/:id",(req,res) => {
    // res.send("one game viewed");
    GameCollection.findById(req.params.id,(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// GET: view game(s) by title
router.get("/games/searchByTitle/:title",(req,res) => {
    // res.send("game(s) found by title");
    GameCollection.find({title: req.params.title},(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });

});

// PUT: edit one game by id
router.put("/games/:id",(req,res) => {
    // res.send("one game updated");
    GameCollection.findByIdAndUpdate(req.params.id,req.body,{new: true},(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// DELETE: delete one game by id
router.delete("/games/:id",(req,res) => {
    // res.send("one game deleted");
    GameCollection.findByIdAndDelete(req.params.id,(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// PUT: relate a game to a user
router.put("/games/relate/:gameID",authenticateToken,async (req,res) => {
    // res.send('game has been related');
    let game,currentUser;
    await GameCollection.findById(req.params.gameID,(errors,results) => {
        if(errors){
            res.send(errors);
        } else {
            game = results;
            UserCollection.findOne({email: req.user.email},(errors,results) => {
                if(errors){
                    res.send(errors);
                } else {
                    currentUser = results;
                    currentUser.gamesOwned.push(game._id);
                    currentUser.save();
                    res.send(currentUser);
                }
            });
        }
    });
});

///////////////////////////////////////////////////////////////
//
//               Posts
//
///////////////////////////////////////////////////////////////

// POST: create a new post and relate it to the user and the game
router.post("/posts/:gameID",authenticateToken,async(req,res) => {
    // res.send("post created and related");
    let post, game, currentUser;
    await PostCollection.create(req.body,(errors,results) => {
        if(errors){
            res.send(errors);
        } else {
            post = results;
            GameCollection.findById(req.params.gameID,(errors,results) => {
                if(errors){
                    res.send(errors);
                } else {
                    game = results;
                    UserCollection.findOne({email: req.user.email},(errors,results) => {
                        if(errors){
                            res.send(errors);
                        } else {
                            currentUser = results;
                            game.relatedPosts.push(post._id);
                            post.relatedGame.push(game._id);
                            currentUser.posts.push(post._id);
                            game.save();
                            post.save();
                            currentUser.save();
                            res.send(post);
                        }
                    })
                }
            })
        }
    })
});

// GET: view all posts
router.get("/posts",(req,res) => {
    // res.send("all posts viewed");
    PostCollection.find((errors,results) => {
        errors ? res.send(errors):res.send(results);
    }).populate("relatedGame");
});

// GET: view one post by id
router.get("/posts/:id",(req,res) => {
    // res.send("one post viewed");
    PostCollection.findById(req.params.id,(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// PUT: edit a post
router.put("/posts/:id",(req,res) => {
    // res.send("post edited");
    PostCollection.findByIdAndUpdate(req.params.id,req.body,{new:true},(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

// DELETE: delete a post
router.delete("/posts/:id",(req,res) => {
    // res.send("post deleted");
    PostCollection.findByIdAndDelete(req.params.id,(errors,results) => {
        errors ? res.send(errors):res.send(results);
    });
});

///////////////////////////////////////////////////////////////
//
//               Authorization
//
///////////////////////////////////////////////////////////////

// authenticate token
function authenticateToken(req,res,next){
    let header = req.headers["authorization"];

    if(header) {
        token = header.split(" ")[1];
        jwt.verify(token,secretKey, (errors,results) => {
            if(errors) {
                res.status(500).json({error: errors});
            } else {
                req.user = results;
                next();
            }
        });
    } else {
        res.status(403).json({error: "Please sign in to access this page"});
    }
}

// export routes
module.exports = router;