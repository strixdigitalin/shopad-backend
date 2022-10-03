const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        itemId: {
            type: String,
            required: true,
        },
        commentBy: {
            type: String,
            required: true,
            ref: users
        },
        comment: {
            type: String,
            required: true,
        }
    }
);

module.exports = mongoose.model('comment', salesofferScheme);