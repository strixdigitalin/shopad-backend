const mongoose = require('mongoose');
const shop = require('./shop');
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
        shopId: {
            type: String,
            ref: shop
        },
        location: {type: String, required: true},
        offerImage: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
    }
);

module.exports = mongoose.model('SalesOffer', salesofferScheme); 