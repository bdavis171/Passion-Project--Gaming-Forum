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
    });
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
router.put("/games/relate/:gameID/:email",async (req,res) => {
    // res.send('game has been related');
    let game,user;
    await GameCollection.findById(req.params.gameID,(errors,results) => {
        if(errors){
            res.send(errors);
        } else {
            game = results;
            UserCollection.findOne({email: req.params.email},(errors,results) => {
                if(errors){
                    res.send(errors);
                } else {
                    user = results;
                    user.gamesOwned.push(game._id);
                    user.save();
                    res.send(user);
                }
            })
        }
    })
})

// export routes
module.exports = router;