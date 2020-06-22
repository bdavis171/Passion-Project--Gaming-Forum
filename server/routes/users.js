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
router.post('/register', (req, res) => {
    // res.send('user has been registered');
    UserCollection.findOne({ email: req.body.email }).then(user => {
        if (user) {
            res.json({ error: `User with email ${req.body.email} already exists` });
        } else {
            // create the new user
            const newUser = new UserCollection(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                }
            );
            // encrypt password
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) {
                        res.status(500).json({ error: "An error has occured while hashing" });
                    } else {
                        newUser.password = hash;
                        newUser.save().then(user => res.json(user));
                    }
                });
            });
        }
    });
});

// POST: login a user
router.post("/login", (req, res) => {
    // res.send(user has logged in);
    UserCollection.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            res.status(404).json({ error: "Email/Password is incorrect" });
        } else {
            bcrypt.compare(req.body.password, user.password).then((isMatched) => {
                if (isMatched) {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                    jwt.sign(payload, secretKey, { expiresIn: 3600 }, (error, token) => {
                        error
                            ? res.status(404).json({ error: error })
                            : res.json({ token: `bearer ${token}` });
                    });
                } else {
                    res.status(500).json({ error: "Email/Password is incorrect" });
                }
            });
        }
    });
});

// GET: Find one user by email
router.get("/:email",(req,res) => {
    UserCollection.findOne({email: req.params.email}, (errors,results) => {
        errors ? res.status(404).json({error: "User not found"}):res.send(results);
    })//.populate("gamesOwned");
});

// POST: verify user
router.post("/verify", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (error, results) => {
        error
            ? res.status(500).json({ error: "verificaiton error!!!" })
            : res.json({ message: results });
    });
});

// verify user token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403).json({ error: "Fobbiden" });
    }
}

// export routes
module.exports = router;