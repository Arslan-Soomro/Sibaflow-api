const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    //The id of user, who polled the vote
    u_id : {
        type : ObjectId,
        required : true,
        trim : true, 
    },
    //The id of comment, the vote was polled on
    c_id : {
        type : ObjectId, 
        required : true,
        trim : true,
    },
    //The status of the vote, does the comment liked or not
    status : {
        type : String,
        required : true,
        trim : true,
    }
});

const VoteModel = new mongoose.Schema(VoteSchema);

module.exports = VoteModel;