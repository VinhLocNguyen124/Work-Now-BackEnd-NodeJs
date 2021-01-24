const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    idusersend: {
        type: String,
        required: true
    },
    iduserrecieve: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Requests', RequestSchema);