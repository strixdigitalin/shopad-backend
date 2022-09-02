const mongoose = require('mongoose');

const productScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {type: String, required: true},
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        mobile: {type: String, required: true},
        password: {type: String, required: true},
        userType: {
            type: String,
            required: true,
            enum: ["admin", "user", "shop"]
        },
        isSubscribed: {type: Boolean, required: true, default: false},
        isActive: {type: Boolean, required: true, default: true},
        userProfile: {type: String}, 
        transactionId: {type: String, default: null} ,
        subscriptionId: {type: String, default: null} ,
        resetToken: {
            type: String,
            default: null
        },
    }
);

module.exports = mongoose.model('User', productScheme);