const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const CommentModel = require('../models/CommentModel');
const PostModel = require('../models/PostModel');
const { throwErr } = require('../utils/utils');
const { objHasVals } = require('../utils/utils');

//TODO Create A Comment
router.post('/', async (req, res) => {
    const u_id = req.body.IT_DATA?._id;
    const p_id = req.body.p_id;

    try{

        if(u_id != undefined){
            if(p_id != undefined){
                
                //This is to verify, if such a post with this user exists
                const prevPost = await PostModel.findById(p_id);
            
                if(prevPost === null) throwErr(403);

                if(objHasVals(["content"], req.body)){
                    const newComment = new CommentModel({ u_id, p_id, content: req.body.content }); // Create new post
                    await newComment.save();
                    res.status(201).json(newComment); //Save new post
                    return ;
                }else throwErr(400)
            }else throwErr(400);
        }else throwErr(401);

    }catch(err){
        if(err.code === 400){
            res.status(err.code).json({message: 'Bad Request, Some of the entries are missing'});
        }else if(err.code === 401){
            res.status(err.code).json({message: 'Invalid Access Token'});
        }else if(err.code === 403){
            res.status(err.code).json({message: 'You don not have the permission to perform this action'});
        }else{
            console.log('Error@CreateComment: ' + err.message);
            res.status(500).json({message: 'Server has faced some issue while processing your request'});
        }
    }
});

//TODO Edit A Comment
//TODO Delete A Comment

module.exports = router;