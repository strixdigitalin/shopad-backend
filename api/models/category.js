const mongoose = require('mongoose');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        categoryName: {type: String, required: true}
    }
);

module.exports = mongoose.model('Category', salesofferScheme); 