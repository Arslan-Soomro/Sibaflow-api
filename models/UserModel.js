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
        unique: true,
        maxlength: 60,
    },
    cms: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        maxlength: 60,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;