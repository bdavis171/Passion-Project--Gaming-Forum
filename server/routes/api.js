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


///////////////////////////////////////////////////////////////
//
//                 Game Routes
//
//////////////////////////////////////////////////////////////

// POST: add a new game
router.post("/games",(req,res)=> {
    res.send("new game added");
});

// GET: view all games
router.get("/games",(req,res) => {
    res.send("all games viewed")
});

// GET: view one game by id
router.get("")

// export routes
module.exports = router;