const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        customerid: {type: String, required: true},
        workid: {type: String, required: true},
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        }
    }
);

module.exports = mongoose.model('Rating', salesofferScheme); 