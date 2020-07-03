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
const ReplyCollection = require('../models/ReplySchema');
const PlatformCollection = require('../models/PlatformSchema');
const { populate } = require('../models/GameSchema');


///////////////////////////////////////////////////////////////
//
//                 Game Routes
//
//////////////////////////////////////////////////////////////

// POST: add a new game and relate it to a platform
router.post("/games/:platformID", async (req, res) => {
    // res.send("new game added");
    let game, platform;
    await GameCollection.create(req.body, (errors, results) => {
        errors ? res.send(errors)
            :
            game = results;
        PlatformCollection.findById(req.params.platformID, (errors, results) => {
            errors ? res.send(errors)
                :
                platform = results;
            game.platform.push(platform._id);
            platform.games.push(game._id);
            
            game.save();
            platform.save();
            console.log(platform.games);
            res.send(game);
        })
    });
});

// GET: view all games
router.get("/games", (req, res) => {
    // res.send("all games viewed")
    GameCollection.find((errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate("relatedPosts").populate("platform");
});

// GET: view one game by id
router.get("/games/:id", (req, res) => {
    // res.send("one game viewed");
    GameCollection.findById(req.params.id, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate("platform").populate({path:"relatedPosts",populate:"author"});
});

// GET: view game(s) by title
router.get("/games/searchByTitle/:title", async(req, res) => {
    // res.send("game(s) found by title");
    let searchResults = [];
    GameCollection.find( (errors, results) => {
        errors ? res.send(errors) : 
        results.forEach(
            (game) => {
                if(game.title.includes(req.params.title)){
                    searchResults.push(game);
                }
            }
        );
        res.send(searchResults);
    }).populate("platform");

});

// PUT: edit one game by id
router.put("/games/:id", (req, res) => {
    // res.send("one game updated");
    GameCollection.findByIdAndUpdate(req.params.id, req.body, { new: true }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

// DELETE: delete one game by id
router.delete("/games/:id", (req, res) => {

    GameCollection.findByIdAndDelete(req.params.id, (errors, results) => {
        errors ? res.send(errors) : 
        results.relatedPosts.forEach(
            (post) => {
                PostCollection.findByIdAndDelete(post._id,(error,results2 => {
                    error ? res.send(error):
                    results2.replies.forEach(
                        (reply) => {
                            ReplyCollection.findByIdAndDelete(reply,(errors,results3) => {
                                errors ? res.send(errors): res.send(results);
                            })
                        }
                    )
                }))
            }
        )
       

    }).populate("relatedPosts");

    PlatformCollection.find((errors, results) => {
        errors ? res.send(errors)
            :
            results.map((platform) => {
                platform.games.splice(platform.games.indexOf(req.params.id), 1);
                platform.save();
            });
    });

    UserCollection.find((errors, results) => {
        errors ? res.send(errors)
            :
            results.map((user) => {
                user.gamesOwned.splice(user.gamesOwned.indexOf(req.params.id), 1);
                user.save();
                console.log(user.gamesOwned);
            })
    })

});

// PUT: relate a game to a user
router.put("/games/relate/:gameID", authenticateToken, async (req, res) => {

    let game, currentUser;
    await GameCollection.findById(req.params.gameID, (errors, results) => {
        if (errors) {
            res.send(errors);
        } else {
            game = results;
            UserCollection.findById(req.user.id, (errors, results) => {
                if (errors) {
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
//                 Platform Routes
//
//////////////////////////////////////////////////////////////

// POST: add a new platform
router.post("/platform", (req, res) => {

    PlatformCollection.create(req.body, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

// GET: view all platforms
router.get("/platform", (req, res) => {

    PlatformCollection.find((errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate("relatedPosts").populate("games");
});

// GET: view one platform by name
router.get("/platform/:name", (req, res) => {

    PlatformCollection.findOne({ name: req.params.name }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate({path:"relatedPosts",populate:"author"}).populate("games");
});

// PUT: edit one platform by name
router.put("/platform/:name", (req, res) => {

    PlatformCollection.findOneAndUpdate({ name: req.params.name }, req.body, { new: true }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

// DELETE: delete one platform by name
router.delete("/platform/:name", (req, res) => {
    // find the platform
    PlatformCollection.findOne({ name: req.params.name }, (errors, results) => {
        errors ? res.send(errors)
            :

            // delete the posts related to the platform
            results.relatedPosts.forEach(post => {
                PostCollection.findByIdAndDelete(post._id, (errors, results) => {
                    errors ? res.send(errors) : console.log(results);
                })
            })

        results.games.forEach(game => {
            // get all users and remove the game from their list of games
            UserCollection.find((errors, results) => {
                errors ? res.send(errors)
                    :
                    results.map((user) => {
                        user.gamesOwned.splice(user.gamesOwned.indexOf(game._id), 1);
                        user.save();
                        console.log(user.gamesOwned);
                    })
            })

            // find and delete all games of the platform
            GameCollection.findByIdAndDelete(game._id, (errors, results) => {
                errors ? res.send(errors)
                    :
                    console.log(results);
            })
        });
    })

    // delete the platform
    PlatformCollection.findOneAndDelete({ name: req.params.name }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

///////////////////////////////////////////////////////////////
//
//               Posts
//
///////////////////////////////////////////////////////////////

// POST: create a new post and relate it to the user and the game
router.post("/posts/game/:gameID", authenticateToken, async (req, res) => {
    // res.send("post created and related");
    let post, game, currentUser;
    await PostCollection.create(req.body, (errors, results) => {
        if (errors) {
            res.send(errors);
        } else {
            post = results;
            GameCollection.findById(req.params.gameID, (errors, results) => {
                if (errors) {
                    res.send(errors);
                } else {
                    game = results;
                    UserCollection.findById(req.user.id, (errors, results) => {
                        if (errors) {
                            res.send(errors);
                        } else {
                            currentUser = results;
                            game.relatedPosts.push(post._id);
                            post.relatedGame.push(game._id);
                            currentUser.posts.push(post._id);
                            post.author.push(currentUser._id);
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

// POST: create a post and relate it to a platform
router.post("/posts/platform/:platformName", authenticateToken, async (req, res) => {
    // res.send("post created and related");
    let post, platform, currentUser;
    await PostCollection.create(req.body, (errors, results) => {
        if (errors) {
            res.send(errors);
        } else {
            post = results;
            PlatformCollection.findOne({name: req.params.platformName}, (errors, results) => {
                if (errors) {
                    res.send(errors);
                } else {
                    platform = results;
                    UserCollection.findById(req.user.id, (errors, results) => {
                        if (errors) {
                            res.send(errors);
                        } else {
                            currentUser = results;
                            platform.relatedPosts.push(post._id);
                            post.relatedPlatform.push(platform._id);
                            currentUser.posts.push(post._id);
                            post.author.push(currentUser._id);
                            platform.save();
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
router.get("/posts", (req, res) => {
    // res.send("all posts viewed");
    PostCollection.find((errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate({path:"relatedGame",populate:("platform")}).populate({path:"replies",populate:"author"}).populate("relatedPlatform").populate("author")
});

// GET: view one post by id
router.get("/posts/:id", (req, res) => {
    // res.send("one post viewed");
    PostCollection.findById(req.params.id, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate({path:"relatedGame",populate:("platform")}).populate({path:"replies",populate:"author"}).populate("relatedPlatform").populate("author");
});

// PUT: edit a post
router.put("/posts/:id", (req, res) => {
    // res.send("post edited");
    PostCollection.findByIdAndUpdate(req.params.id, req.body, { new: true }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

// DELETE: delete a post
router.delete("/posts/:id", (req, res) => {
    // find the post
    PostCollection.findById(req.params.id,(errors,results) => {
        errors ? res.send(errors)
        :
        
        results.replies.forEach(reply => {
            // remove the replies from the users
            UserCollection.find((errors,results) => {
                errors ? res.send(errors)
                :
                results.map(user => {
                    user.replies.splice(user.replies.indexOf(reply),1);
                    user.save()
                });
            });

            // delete the replies for the post
            ReplyCollection.findByIdAndDelete(reply._id,(errors,results) => {
                errors ? res.send(errors):console.log(results);
            })
        });
    });

     // remove the post from the user
     UserCollection.find((errors,results) => {
        errors ? res.send(errors)
        :
        results.map(user => {
            user.posts.splice(user.posts.indexOf(req.params.id),1);
            user.save();
        });
    });

    // delete the post
    PostCollection.findByIdAndDelete(req.params.id, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

///////////////////////////////////////////////////////////////
//
//                Replyies
//
//////////////////////////////////////////////////////////////

// POST: create a new reply and relate it to a post and user
router.post("/reply/:postID", authenticateToken, async (req, res) => {
    // res.send("reply created");
    let reply, post, currentUser;
    await ReplyCollection.create(req.body, (errors, results) => {
        if (errors) {
            res.send(errors);
        } else {
            reply = results;
            PostCollection.findById(req.params.postID, (errors, results) => {
                if (errors) {
                    res.send(errors);
                } else {
                    post = results;
                    UserCollection.findById(req.user.id, (errors, results) => {
                        if (errors) {
                            res.send(errors);
                        } else {
                            currentUser = results;
                            reply.relatedPost.push(post._id);
                            post.replies.push(reply._id);
                            currentUser.replies.push(reply._id);
                            reply.author.push(currentUser._id);
                            reply.save();
                            post.save();
                            currentUser.save();
                            res.send(reply);
                        }
                    });
                }
            });
        }
    });
});

// GET: view all replies
router.get("/reply", (req, res) => {
    // res.send("all replies viewed");
    ReplyCollection.find((errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate("relatedPost");
});

// GET: view one reply
router.get("/reply/:id", (req, res) => {
    // res.send("one reply viewed");
    ReplyCollection.findById(req.params.id, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    }).populate("relatedPost").populate("author");
});

// PUT: edit a reply
router.put("/reply/:id", (req, res) => {
    
    ReplyCollection.findByIdAndUpdate(req.params.id, req.body, { new: true }, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});

// DELETE: delete a reply
router.delete("/reply/:id", (req, res) => {
    // remove the reply from the post
    PostCollection.find((errors,results) => {
        errors ? res.send(errors)
        :
        results.map(post => {
            post.replies.splice(post.replies.indexOf(req.params.id),1);
            post.save();
        });
    });

    // remove the reply from the user
    UserCollection.find((errors,results) => {
        errors ? res.send
        :
        results.map(user => {
            user.replies.splice(user.replies.indexOf(req.params.id),1);
            user.save();
        })
    })
  
    // delete the reply
    ReplyCollection.findByIdAndDelete(req.params.id, (errors, results) => {
        errors ? res.send(errors) : res.send(results);
    });
});


///////////////////////////////////////////////////////////////
//
//               Authorization
//
///////////////////////////////////////////////////////////////

// authenticate token
function authenticateToken(req, res, next) {
    let header = req.headers["authorization"];

    if (header) {
        token = header.split(" ")[1];
        jwt.verify(token, secretKey, (errors, results) => {
            if (errors) {
                res.status(500).json({ error: errors });
            } else {
                req.user = results;
                next();
            }
        });
    } else {
        res.status(403).json({ error: "Please sign in to access this page" });
    }
}

// export routes
module.exports = router;