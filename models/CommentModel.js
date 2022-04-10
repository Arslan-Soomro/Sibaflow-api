const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    //User id person who has commented
    u_id : {
        type: ObjectId,
        required: true,
        trim: true
    },
    //post id of the post the comment was wrote for
    p_id : {
        type: ObjectId,
        required: true,
        trim: true
    },
    //What the comment says
    content : {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

const CommentModel = mongoose.model(CommentSchema);

export default CommentModel;