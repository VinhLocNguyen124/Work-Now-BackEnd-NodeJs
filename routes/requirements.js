const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Company = require('../models/Company');
const RequirementSkill = require('../models/RequirementSkill');
const Notification = require('../models/Notification');

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

        const req = await Requirement.findOne({ _id: requirement._id })

        const savedrequirement = await requirement.save();

        const listskill = req.body.listskill;

        listskill && await Promise.all(listskill.map(async item => {
            const reSkill = new RequirementSkill({
                idrequirement: requirement._id,
                idskill: item._id
            })

            const savedReSkill = await reSkill.save();
        }));



        let idpotentialuser = ""

        let lastpointuser = 0;

        //getalluser here
        const allUser = await User.find({ underwork: true });
        await Promise.all(allUser.map(async oneUser => {
            const userschool = await UserSchool.find({ iduser: oneUser._id }).exec();
            const usercompany = await UserCompany.find({ iduser: oneUser._id }).exec();
            const userskill = await UserSkill.find({ iduser: oneUser._id }).exec();
            const requests = await Request.find({ iduserrecieve: oneUser._id, status: "pending" }).exec();

            let companies = [];
            if (usercompany.length > 0) {
                companies = await Promise.all(usercompany.map(async usercomp => {
                    // iduser, idcompany, idposition
                    const company = await Company.findOne({ _id: usercomp.idcompany }).exec();
                    const position = await Position.findOne({ _id: usercomp.idposition }).exec();
                    return {
                        _id: usercomp._id,
                        companyname: company.name,
                        position: position.name,
                        major: usercomp.major,
                        expyear: usercomp.expyear
                    }
                }));
            }

            let userSkills = [];
            if (userskill.length > 0) {
                userSkills = await Promise.all(userskill.map(async item => {
                    // iduser, idcompany, idposition
                    const skill = await Skill.findOne({ _id: item.idskill }).exec();

                    return {
                        _id: item._id,
                        name: skill.name,
                        type: skill.type,
                        important: item.bestskill
                    }
                }));
            }

            let pointuser = 0

            listskill.map(itemRe => {
                userSkills.map(itemUser => {
                    if (itemRe.name === itemUser.name) {
                        pointuser += 10
                    }
                })
            });

            if (oneUser.province === req.province) {
                pointuser += 10;
            }

            if (oneUser.city === req.city) {
                pointuser += 10;
            }

            if (pointuser > lastpointuser) {
                lastpointuser = pointuser;
                idpotentialuser = oneUser._id
            }


        }));


        const notifi = new Notification({
            type: "candidate",
            iduserrecieve: req.body.iduser,
            idpost: "",
            idmatcheduser: idpotentialuser,
            content: "Đã tìm thấy ứng viên phù hợp",
            read: false,
        });

        const savedNoti = await notifi.save()




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
