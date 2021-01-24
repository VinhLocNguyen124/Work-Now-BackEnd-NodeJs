const mongoose = require('mongoose');

const RequirementSchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    idposition: {
        type: String,
        required: true
    },
    jobdescription: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    idcompany: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    jobname: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },

});

module.exports = mongoose.model('Requirements', RequirementSchema);