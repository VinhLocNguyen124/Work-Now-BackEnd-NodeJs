const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    emailuser: {
        type: String,
        required: true
    },
    idpostshare: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imgurl: {
        type: String,
        required: true
    },
    seescope: {
        type: String,
        required: true
    },
    allowcmt: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Posts', PostSchema);