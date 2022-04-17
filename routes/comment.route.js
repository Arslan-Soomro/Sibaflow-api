const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const CommentModel = require('../models/CommentModel');
const PostModel = require('../models/PostModel');
const { throwErr, resErr } = require('../utils/utils');
const { objHasVals } = require('../utils/utils');


//Retrieves all comments, if id is provided only one comment with that id is provided, if p_id is provided all comments from that post are retrieved
router.get('/', async(req, res) => {
    const id = req.query.id;
    const p_id = req.query._id;

    try {
      let comments;
        
      if(id !== undefined){
        comments = await CommentModel.findById(id); //FIXME, throws error if id is incorrect
      }else if(p_id != undefined){
        comments = await CommentModel.find({p_id: mongoose.Types.ObjectId(p_id)});
      }else {
        comments = await CommentModel.find({});
      } 

      res.status(200).json(comments);
    } catch (err) {
      console.log("Error@Get-Posts: " + err);
      res.status(500).json({
        message:
          "The Server has faced some problem while processing your request",
      });
    }
});

//Creates A Comment
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

//Updates a comment
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

//Deletes A Comment
router.delete('/', async (req, res) => {
    const u_id = req.body.IT_DATA?._id;
    const id = req.body.id; //ID of the comment to be deleted;

    try{
        if(u_id != undefined){
            if(id){
                const prevComment = await CommentModel.findOne({ _id: mongoose.Types.ObjectId(id), u_id: mongoose.Types.ObjectId(u_id) });
                if(prevComment === null) throwErr(403)
                const deletedComment = await CommentModel.findByIdAndDelete(id);
                res.status(200).json({message: 'Comment Deleted Successfully', data: deletedComment});
            }else throwErr(400);
        }else throwErr(401);
    }catch(err){
        resErr(res, err.code, err.message, 'DeleteComment');
    }
});


module.exports = router;