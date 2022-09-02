const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        customerName: {type: String, required: true},
        customerNumber: {type: String, required: true},
        customerEmail: {type: String, required: true},
        feedbackNumber: {type: String, required: true},
        feedback: {type: String, required: true},
        feedbackFor: {type: String, required: true, enum: ["offer", "job", "work"]},
    }
);

module.exports = mongoose.model('Feedback', salesofferScheme); 