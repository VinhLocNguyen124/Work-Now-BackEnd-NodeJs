const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');

//Submit one  comment
router.post('/', async (req, res) => {

    const comment = new Comment({
        iduser: req.body.iduser,
        idpost: req.body.idpost,
        cmtcontent: req.body.cmtcontent,
    });

    //Hàm save() trả về một promise
    try {

        const savedComment = await comment.save();

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedComment,
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
