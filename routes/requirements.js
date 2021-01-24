const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Company = require('../models/Company');
const RequirementSkill = require('../models/RequirementSkill');

//Submit one  requirement
router.post('/', async (req, res) => {

    const company = new Company({
        name: req.body.companyname
    });

    try {
        const savedcompany = await company.save();
        const newCompany = await Company.findOne({ name: req.body.companyname }).exec();

        const requirement = new Requirement({
            iduser: req.body.iduser,
            idposition: req.body.idposition,
            jobdescription: req.body.jobdescription,
            idcompany: newCompany._id,
            province: req.body.province,
            city: req.body.city,
            jobname: req.body.jobname,
            active: true,
        })

        const savedrequirement = await requirement.save();

        const listskill = req.body.listskill;

        listskill && await Promise.all(listskill.map(async item => {
            const reSkill = new RequirementSkill({
                idrequirement: requirement._id,
                idskill: item._id
            })

            const savedReSkill = await reSkill.save();
        }));

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedrequirement,
            }
        });
    } catch (err) {
        res.json({ message: err });
    }

});

// //Get all skill
// router.get('/', async (req, res) => {
//     try {

//         const skills = await Skill.find();

//         res.json(skills);

//     } catch (err) {
//         res.json({ message: err });
//     }
// });

// //Update user edu
// router.put('/updateskill/:userskillid', async (req, res) => {

//     try {

//         const updateUserSkill = await UserSkill.updateOne(
//             { _id: req.params.userskillid },
//             {
//                 $set: {
//                     bestskill: req.body.bestskill

//                 }
//             }
//         )
//         res.json({
//             status: "success", response: {
//                 updateUserSkill,
//             }
//         });
//     } catch (err) {
//         res.json({ message: err });
//     }

// });

// //Delete user skill
// router.delete('/deleteskill/:userskillid', async (req, res) => {

//     try {

//         const deleteUserSkill = await UserSkill.deleteOne({ _id: req.params.userskillid })

//         res.json({
//             status: "success", response: {
//                 deleteUserSkill,
//             }
//         });
//     } catch (err) {
//         res.json({ message: err });
//     }

// });

module.exports = router;
