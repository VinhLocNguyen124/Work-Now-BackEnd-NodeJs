const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Companies', CompanySchema);