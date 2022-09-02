const mongoose = require('mongoose');
const job = require('./job');
const users = require('./users');
const salesofferScheme = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        jobId: {
            type: String,
            required: true,
            ref: job
        },
        applicantId: {
            type: String,
            required: true,
            ref: users
        },
        timeStamp: {
            type: String,
            required: true,
        },
        applicantName: {
            type: String,
            required: true,
        },
        applicantContact: {
            type: String,
            required: true,
        },
        applicantEmail: {
            type: String,
            required: true,
            match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        resumeLink:{
            type: String,
            required: true
        }
    }
);
module.exports = mongoose.model('Jobapply', salesofferScheme); 