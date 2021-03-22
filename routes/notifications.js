const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Company = require('../models/Company');
const RequirementSkill = require('../models/RequirementSkill');
const Notification = require('../models/Notification');
const admin = require("firebase-admin");
const serviceAccount = require("./../ServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://work-now-3a6c0-default-rtdb.firebaseio.com"
});

//Test noti send from server
router.post('/:deviceToken', async (req, res) => {

    const deviceToken = req.params.deviceToken;

    try {

        await admin.messaging().sendToDevice(
            deviceToken, // ['token_1', 'token_2', ...]
            {
                data: {
                    imageUrl: "https://www.mathieufontaine.dev/img/logos/react-js.png",
                },
                notification: {
                    body: "Notification send from node server !!",
                    title: "Test server noti",
                },
            },
            {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
            },
        );


        res.json({
            status: "success",
        });
    } catch (err) {
        res.json({ message: err });
    }

});

// //Submit one  requirement
// router.get('/:iduser', async (req, res) => {

//     try {
//         const notis = await Notification.find({ iduserrecieve: req.params.iduser });


//         //trả về khi save thành công
//         res.json(notis);
//     } catch (err) {
//         res.json({ message: err });
//     }

// });

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
