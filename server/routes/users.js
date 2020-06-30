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
const PostCollection = require('../models/PostSchema');
const ReplyCollection = require('../models/ReplySchema');


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
            res.status(404).json({ error: "Incorrect login credentials" });
        } else {
            bcrypt.compare(req.body.password, user.password).then((isMatched) => {
                if (isMatched) {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                    jwt.sign(payload, secretKey, { expiresIn: 43200 }, (error, token) => {
                        error
                            ? res.status(404).json({ error: error })
                            : res.json({ token: `bearer ${token}` });
                    });
                } else {
                    res.status(500).json({ error: "Incorrect login credentials" });
                }
            });
        }
    });
});

// GET: Find one user by email
router.get("/:email", (req, res) => {
    UserCollection.findOne({ email: req.params.email }, (errors, results) => {
        errors ? res.status(404).json({ error: "User not found." }) : res.send(results);
    }).populate("gamesOwned").populate({path:"posts",populate:{path:"relatedGame",populate:"platform"}}).populate({path:"replies",populate:"relatedPost"}).populate({path:"posts",populate:"relatedPlatform"});
});

// POST: verify user
router.post("/verify", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (error, results) => {
        error
            ? res.status(500).json({ error: "verificaiton error!!!" })
            : res.json({ message: results });
    });
});

//Update user by id
router.put("/:id", (req, res) => {

    if (!req.body.password) {
        UserCollection.findByIdAndUpdate(
            req.params.id, req.body, { new: true }, (error, results) => {
                error ? res.send(error) : res.send(results);
            }
        );
    } else {
        let password = req.body.password;
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    res.send(error);
                } else {
                    req.body.password = hash;

                    UserCollection.findByIdAndUpdate(
                        req.params.id, req.body, { new: true }, (error, results) => {
                            error ? res.send(error) : res.send(results);
                        }
                    );
                }
            });
        });
    }
});

// DELETE: delete user
router.delete("/:email", (req, res) => {
    // find the user
    UserCollection.findOne({ email: req.params.email }, (errors, results) => {
        errors ? res.send(errors)
            :
            results.posts.forEach(post => {
                // delete the post for that user
                PostCollection.findByIdAndDelete(post._id, (errors, results) => {
                    errors ? res.send(errors) : console.log(results);
                });

            });

        results.posts.forEach(reply => {
            // delete the replies for that user
            ReplyCollection.findByIdAndDelete(reply._id,(errors,results) => {
                errors ? res.send(errors) : console.log(results);
            })
        }
        );

    })

    // delete the user
    UserCollection.findOneAndDelete(
        { email: req.params.email }, (error, results) => {
            error ? res.send(error) : res.send(results);
        }
    );
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