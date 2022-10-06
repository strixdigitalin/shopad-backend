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
            default: true
        },
        location: {type: String, required: true},
        shopName: {type: String, required: true},
        designationName: {type: String, required: true},
        salary: {type: String, required: true},
        contactNumber: {type: String, required: true},
        contactEmail: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
    }
);

module.exports = mongoose.model('Job', salesofferScheme); 