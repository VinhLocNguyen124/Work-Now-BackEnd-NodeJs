const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    iduserrecieve: {
        type: String,
        required: true
    },
    idpost: {
        type: String,
        required: false
    },
    idmatcheduser: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Notifications', NotificationSchema);