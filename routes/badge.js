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
        let badge = 0;
        let count = 0;
        let listId = [];

        const user = await User.findOne({ email: req.params.email }).exec();
        const idCurrentUser = user._id;

        const db = admin.database();

        const query = db.ref('roomchats');

        await query.once("value", snapshot => {

            snapshot.forEach(child => {
                const room = child.val();

                if (idCurrentUser == room.iduser1) {
                    count++;
                    listId.push({
                        id1: room.iduser1,
                        id2: room.iduser2
                    });
                    badge++;
                    // if (room.unread === true) {
                    //     badge = badge + 1;
                    // }
                }
            });
        })

        res.json({
            badge: badge,
            count: count,
            list: listId,
            id: idCurrentUser
        });

    } catch (err) {
        res.json({ message: err.message });
    }

});

module.exports = router;
