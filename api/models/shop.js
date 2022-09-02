const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        description: {type: String, required: true},
        ownerId: {
            type: String,
            required: true,
            ref: users
        },
        isActive: {
            type: Boolean,
            required: true,
            default: false
        },
        location: {type: String, required: true},
        shopName: {type: String, required: true},
    }
);

module.exports = mongoose.model('Shop', salesofferScheme); 