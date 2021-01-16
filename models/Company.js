const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    urlimage: {
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
    address: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Companies', CompanySchema);