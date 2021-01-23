const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');


//Get all skill
router.get('/', async (req, res) => {
    try {

        const skills = await Skill.find();

        res.json(skills);

    } catch (err) {
        res.json({ message: err });
    }
});

//Submit skills
router.post('/', async (req, res) => {

    const skill = new Skill({
        username: req.body.username,
        email: req.body.email,
    });

    const arrSkill = req.body.array;

    //Hàm save() trả về một promise
    try {

        Skill.insertMany(arrSkill, function (error, docs) { });

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedUser,
            }
        });

    } catch (err) {
        res.json({ message: err });
    }

});

//Submit one user skill
router.post('/', async (req, res) => {

    const userskill = new UserSkill({
        iduser: req.body.iduser,
        idskill: req.body.idskill,
        bestskill: req.body.bestskill,
    });

    //Hàm save() trả về một promise
    try {

        const savedUserSkill = await userskill.save();

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedUserSkill,
            }
        });

    } catch (err) {
        res.json({ message: err });
    }

});






module.exports = router;
