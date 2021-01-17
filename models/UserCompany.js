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

// 600390d7e592f7bc8d0b39ef: comp
// 60038c33d384fb0017969cc7: position
// 60038bd1d0bcc900177fddf7: user

module.exports = mongoose.model('UserCompanies', UserCompanySchema);