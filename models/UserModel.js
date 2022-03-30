const mongoose = require('mongoose');

//ID is generated Automatically
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
    },
    cms: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        trim: true
    },
    email: {
        type: String,
        maxlength: 60,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 20
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;