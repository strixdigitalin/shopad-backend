const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        code: {type: String, unique: true},
        discount: {type: Number, max: 100, min: 0, default: null},
        count: {
            type: Number,
            default: 0
        },
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     default: null
        // }
        user: {
            type: Object,
            default: null
        },
        subCoupan: {
            type: Array,
            default: []
        }
    }
);
module.exports = mongoose.model('Coupon', salesofferScheme); 