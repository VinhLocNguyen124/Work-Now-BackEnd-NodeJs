const mongoose = require('mongoose');

const UserSchoolSchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    schoolname: {
        type: String,
        required: false
    },
    major: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('UserSchools', UserSchoolSchema);