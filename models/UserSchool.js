const mongoose = require('mongoose');

const UserSchoolSchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    schoolname: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    schoolyear: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('UserSchools', UserSchoolSchema);