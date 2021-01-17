const mongoose = require('mongoose');

const SkillSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        // type: "framework" || "language" || "other"
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Skills', SkillSchema);