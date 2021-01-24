const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    idpost: {
        type: String,
        required: true
    },
    cmtcontent: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Comments', CommentSchema);