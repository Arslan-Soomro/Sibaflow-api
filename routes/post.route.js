const express = require("express");
const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const PostModel = require("../models/PostModel");
const { verifyToken, objHasVals, createObjVals } = require("../utils/utils");
const router = express.Router();

//With every request that carries a token, the token is verified here
router.use((req, res, next) => {
  //Extract token from header
  const token = req.header("token");

  if (token != undefined) {
    //If token exists
    let tokenData = verifyToken(token); //Verify Token
    if (tokenData != undefined) {
      //Verified Token
      req.body.IT_DATA = tokenData; //
    }
  }

  next();
});

//If Id is provided, post with that id is fetched otherwise all posts are fetched
router.get("/", async (req, res) => {
  const id = req.query.id;

  try {
    let posts;

    if (id === undefined) {
      posts = await PostModel.find({});
    } else {
      //Returns null if no post with such id exist
      posts = await PostModel.findById(id); //FIXME throws if id is incorrect
    }

    res.status(200).json(posts);
  } catch (err) {
    console.log("Error@Get-Posts: " + err);
    res.status(500).json({
      message:
        "The Server has faced some problem while processing your request",
    });
  }
});

//For getting Posts of a specific user
router.get("/user/:u_id", async (req, res) => {
  const u_id = req.params.u_id;

  try {
    const posts = await PostModel.find({ u_id: mongoose.Types.ObjectId(u_id) });
    res.status(200).json(posts);
  } catch (err) {
    console.log("Error@Post/User/:UID : " + err.message);
    res.status(500).json({
      message:
        "The Server has faced some problem while processing your request",
    });
  }
});

//For Creating a post
router.post("/", async (req, res) => {
  try {
    if (req.body.IT_DATA != undefined) {
      // verified token
      if (objHasVals(["title", "content"], req.body)) {
        // Verify correct data
        const postDataObj = {
          u_id: req.body.IT_DATA._id, //The user id of the user who creates this post
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags != undefined ? req.body.tags : [],
        };
        const newPost = new PostModel(postDataObj); // Create new post
        await newPost.save();
        res.status(201).json(newPost); //Save new post
      } else {
        res.status(400).json({ message: "One of the entries are missing" });
      }
    } else {
      res.status(401).json({ message: "Invalid Access Token" });
    }
  } catch (err) {
    console.log("Error@PostCreate: " + err.message);
    res.status(500).json({
      message: "Server has faced somes issue while processing your request",
    });
  }
});

//Updates a Post
router.patch("/", async (req, res) => {
  try {
    const p_id = req.body.id;
    const u_id = req.body.IT_DATA?._id;

    if (u_id != undefined) {
      if (p_id != undefined) {
        const valsToCheck = ["title", "content", "tags"];
        let dataObj = req.body;
        const valsToUpdate = createObjVals(valsToCheck, dataObj);
    

        if(valsToUpdate != null){
            //This is to verify, if such a post with this user exists
            const prevPost = await PostModel.find({u_id: mongoose.Types.ObjectId(u_id), _id: mongoose.Types.ObjectId(p_id)});
            
            if(prevPost === null){
                res.status(400).json({message: "You don't have the permission to edit this Post"});
                return ;
            }

            const updatedPost = await PostModel.findByIdAndUpdate(
                p_id,
                { ...valsToUpdate }, //If Faced with problems spread dataObj here rather than valsToUpdate
                { returnDocument: "after"}
              );
              res
                .status(200)
                .json({ message: "Update Successful", data: updatedPost });
              return;
        }else{
            res.status(400).json({
                message: "One of the entries are missing"
            })
        }
      } else {
        res.status(400).json({
          message: "Invalid Post Id",
        });
      }
    } else {
      res.status(401).json({
        message: "Invalid Access Token",
      });
    }
  } catch (err) {
    console.log("Error@PostPatch: " + err.message);
    res.status(500).json({
      message: "Server has faced somes issue while processing your request",
    });
  }
});

router.delete("/", async (req, res) => {
    try {
      const p_id = req.body.id;
      const u_id = req.body.IT_DATA?._id;

      if (u_id != undefined) {
        if (p_id != undefined) {
            //This is to verify, if such a post with this user exists
            const prevPost = await PostModel.find({u_id: mongoose.Types.ObjectId(u_id), _id: mongoose.Types.ObjectId(p_id)});
            
            if(prevPost === null){
                res.status(400).json({message: "You don't have the permission to edit this Post"});
                return ;
            }

            const deletedPost = await PostModel.findByIdAndDelete(p_id);

            res.status(200).json({
                message: 'Post Deleted Successfully',
                data: deletedPost
            })
        }else{
            res.status(400).json({
                message: "Invalid Post Id",
            });
        }
      }else{
        res.status(401).json({
            message: "Invalid Access Token",
        });
      }
    }catch(err){
        console.log("Error@PostDelete: " + err.message);
        res.status(500).json({
            message: "Server has faced some issue while processing your request"
        })
    }
})

module.exports = router
