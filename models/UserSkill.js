const mongoose = require('mongoose');

const UserSkillSchema = mongoose.Schema({
    iduser: {
        type: String,
        required: true
    },
    idskill: {
        type: String,
        required: true
    },
    bestskill: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model('UserSkills', UserSkillSchema);