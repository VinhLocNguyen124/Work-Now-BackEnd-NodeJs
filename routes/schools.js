const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserSchool = require('../models/UserSchool');

//Get all userschools
router.get('/', async (req, res) => {
    try {
        const userschools = await UserSchool.find().sort({ _id: -1 });
        res.json(userschools);
    } catch (err) {
        res.json({ message: err });
    }
});

//Adding education
router.post('/addedu', async (req, res) => {

    const userschool = new UserSchool({
        iduser: req.body.iduser,
        schoolname: req.body.schoolname,
        major: req.body.major,
        schoolyear: req.body.schoolyear
    });

    try {

        const savedUserschool = await userschool.save();

        res.json({
            status: "success", response: {
                savedUserschool,
            }
        });

    } catch (err) {
        res.json({ message: err });
    }
});

//Update user edu
router.put('/updateedu/:userschoolid', async (req, res) => {

    try {

        const updateUserSchool = await UserSchool.updateOne(
            { _id: req.params.userschoolid },
            {
                $set: {
                    iduser: req.body.iduser,
                    schoolname: req.body.schoolname,
                    major: req.body.major,
                    schoolyear: req.body.schoolyear
                }
            }
        )
        res.json({
            status: "success", response: {
                updateUserSchool,
            }
        });
    } catch (err) {
        res.json({ message: err });
    }

});


module.exports = router;