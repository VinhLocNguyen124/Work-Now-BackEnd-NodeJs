const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Company = require('../models/Company');
const RequirementSkill = require('../models/RequirementSkill');
const Notification = require('../models/Notification');
const admin = require("firebase-admin");
const sendNotification = require("../helpers/notification");
const findGuessToken = require("../helpers/findGuessToken");

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

//Send notification when have a new message
router.post('/message', async (req, res) => {

    const iduser = req.body.iduser;
    const username = req.body.username;
    const urlavatar = req.body.urlavatar;
    const roomkey = req.body.roomkey;
    const messageContent = req.body.messageContent;
    const lastMessage = req.body.lastMessage;
    const sendingPeriod = (Date.now() - lastMessage.time) / 1000 / 60 / 60;


    try {

        const guessToken = await findGuessToken(roomkey, iduser);
        if (sendingPeriod > 1) {
            sendNotification(guessToken, username, messageContent, urlavatar)
            res.json({
                status: "success",
                time: lastMessage.time
            });
        }

        res.json({
            status: "success",
        });
    } catch (err) {
        res.json({ message: err });
    }

});


module.exports = router;
