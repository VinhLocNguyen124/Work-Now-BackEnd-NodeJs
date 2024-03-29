const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    urlavatar: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    province: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    qrcode: {
        type: String,
        required: false
    },
    headline: {
        type: String,
        required: false
    },
    underwork: {
        type: Boolean,
        required: false
    },
    path: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Users', UserSchema);