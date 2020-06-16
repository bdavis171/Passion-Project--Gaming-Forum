// users routes

// import express
const express = require('express');
const router = express.Router();
router.use(express.json()); // json middleware

// import authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../config/keys').secretOrKey;

// import schema
const UserCollection = require('../models/UserSchema');

// POST: register a user
router.post('/register',(req,res) => {
    res.send('user has been registered');
});

// POST: login a user
router.post('/login',(req,res) => {
    res.send('user has been logged in');
});

// export routes
module.exports = router;