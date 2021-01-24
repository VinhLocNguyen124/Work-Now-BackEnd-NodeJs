const mongoose = require('mongoose');

const RequirementSkillSchema = mongoose.Schema({
    idrequirement: {
        type: String,
        required: true
    },
    idskill: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('RequirementSkills', RequirementSkillSchema);