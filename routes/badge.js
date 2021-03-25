const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Company = require('../models/Company');
const RequirementSkill = require('../models/RequirementSkill');
const Notification = require('../models/Notification');
const admin = require("firebase-admin");

//Test noti send from server
router.post('/message/:email', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.params.email }).exec();
        const idCurrentUser = user._id;

        const db = admin.database();

        const query = db.ref('roomchats').orderByKey();

        await query.once("value", snapshot => {

            let badge = 0;
            let rooms = [];

            snapshot.forEach(async child => {
                const room = child.val();

                if ((idCurrentUser === room.iduser1 || idCurrentUser === room.iduser2) && room.lastMessage) {
                    let idUserGuess = "";

                    if (room.iduser1 === idCurrentUser) {
                        idUserGuess = room.iduser2;
                    } else if (room.iduser2 === idCurrentUser) {
                        idUserGuess = room.iduser1;
                    }

                    rooms.push({
                        _id: child.key,
                        idguess: idUserGuess,
                        message: room.lastMessage,
                        time: room.time,
                        unread: room.unread
                    });

                }
            });

            rooms.forEach(room => {
                if (room.unread === true) badge++;
            });

            res.json({
                badge: badge,
            });
        })

    } catch (err) {
        res.json({ message: err.message });
    }

});

module.exports = router;
