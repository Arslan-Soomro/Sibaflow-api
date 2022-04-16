const express = require('express');
const PostModel = require('../models/PostModel');
const { verifyToken, objHasVals } = require('../utils/utils');
const router = express.Router();

//With every request that carries a token, the token is verified here
router.use((req, res, next) => {
    
    //Extract token from header
    const token = req.header('token');

    if(token != undefined){ //If token exists
        let tokenData = verifyToken(token); //Verify Token
        if(tokenData != undefined){ //Verified Token
            req.body.IT_DATA = tokenData; //
        }
    }

    next();
});

router.post('/', async (req, res) => {
    const userData = req.body.IT_DATA;
    try{
    if(req.body.IT_DATA != undefined){ // verified token
        if(objHasVals(["title", "content"], req.body)){ // Verify correct data
            const postDataObj = {
                u_id: req.body.IT_DATA._id, //The user id of the user who creates this post
                title: req.body.title,
                content: req.body.content,
                tags: req.body.tags != undefined ? req.body.tags : []
            };
            const newPost = new PostModel(postDataObj); // Create new post
            await newPost.save();
            res.status(201).json(newPost) //Save new post
        }else{
            res.status(400).json({"message" : "One of the entries are missing"});
        }
    }else{
        res.status(401).json({message: 'Invalid Token'});
    }
}catch(err){
    console.log("Error@PostCreate: " + err.message);
    res.status(500).json({message: "Server has faced somes issue while processing your request"});
}
});

//TODO Edit Post

//TODO Delete Post

module.exports = router;