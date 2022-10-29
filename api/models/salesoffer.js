const mongoose = require('mongoose');
const shop = require('./shop');
const users = require('./users');


const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        description: {type: String, required: true},
        cateoryId: {type: String, required: true},
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
        offerImage: {type: String, required: false},
        offerImage1: {type: String, required: false},
        offerImage2: {type: String, required: false},
        offerImage3: {type: String, required: false},
        offerImage4: {type: String, required: false},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
    }
);

module.exports = mongoose.model('SalesOffer', salesofferScheme); 