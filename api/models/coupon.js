const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        code: {type: String, required: true, unique: true},
        discount: {type: Number, required: true, max: 100, min: 0},
        count: {
            type: Number,
            required: true
        },
    }
);
module.exports = mongoose.model('Coupon', salesofferScheme); 