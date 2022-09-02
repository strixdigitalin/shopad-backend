const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        to: {type: String, required: true},
        from: {type: String, required: true},
        chatid: {type: String, required: true},
        message: {type: String, required: true},
        timestamp: {type: String, required: true},
    }
);
module.exports = mongoose.model('Chat', salesofferScheme); 