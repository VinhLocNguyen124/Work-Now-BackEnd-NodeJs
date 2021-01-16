const mongoose = require('mongoose');

const UserCompanySchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    idcompany: {
        type: String,
        required: false
    },
    idposition: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('UserCompanies', UserCompanySchema);