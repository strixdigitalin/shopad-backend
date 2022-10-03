const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        itemId: {
            type: String,
            required: true,
        },
        likedBy: {
            type: String,
            required: true,
            ref: users
        }
    }
);

module.exports = mongoose.model('like', salesofferScheme);