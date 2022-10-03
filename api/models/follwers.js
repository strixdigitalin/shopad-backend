const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
            type: String,
            required: true,
            ref: users
        },
        follwedId: {
            type: String,
            required: true,
            
        },
    }
);

module.exports = mongoose.model('follower', salesofferScheme);