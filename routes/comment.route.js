const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const CommentModel = require('../models/CommentModel');
const PostModel = require('../models/PostModel');
const { throwErr, resErr } = require('../utils/utils');
const { objHasVals } = require('../utils/utils');

//TODO Create A Comment
router.post('/', async (req, res) => {
    const u_id = req.body.IT_DATA?._id;
    const p_id = req.body.p_id;

    try{

        if(u_id != undefined){
            if(p_id != undefined){
                
                //This is to verify, if such a post exists
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
        resErr(res, err.code, err.message, 'CreateComment');
    }
});

//TODO Edit A Comment
router.patch('/', async (req, res) => {
    const u_id = req.body.IT_DATA?._id;
    const id = req.body.id; //Id of this comment i.e that needs to be updated
    
    try{
        if(u_id != undefined){
            if(id != undefined && objHasVals(["content"], req.body)){
                //const prevComment = await CommentModel.findByIdAndUpdate(id, {content: req.body.content}, {returnDocument: "after"});
                const prevComment = await CommentModel.findOne({_id: mongoose.Types.ObjectId(id), u_id: mongoose.Types.ObjectId(u_id)})
                
                if(prevComment === null) throwErr(403);
                
                prevComment.content = req.body.content;
                await prevComment.save();

                res.status(200).json({message: "Comment Updated Successfully", data: prevComment});
            }else throwErr(400)
        }else throwErr(401)
    }catch(err){
        resErr(res, err.code, err.message, 'UpdateComment');
    }
});

module.exports = router;