const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');


//Get all skill
router.get('/', async (req, res) => {
    try {

        const skills = await Skill.find().sort({ _id: -1 });

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






module.exports = router;
