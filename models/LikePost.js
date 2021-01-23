const mongoose = require('mongoose');

const LikePostSchema = mongoose.Schema({
    idpost: {
        type: String,
        required: true
    },
    iduser: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('LikePosts', LikePostSchema);