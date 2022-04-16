const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    //The user id of the user who created the post
    u_id : {
        type: mongoose.Types.ObjectId,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 6
    },
    content: {
        type: String,
        required: true,
        minlength: 6
    },
    tags: {
        type: [String],
    }
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;