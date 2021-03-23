const express = require('express');
const { database } = require('firebase-admin');
const router = express.Router();
const admin = require("firebase-admin");

//Test noti send from server
router.post('/saveusertoken', async (req, res) => {

    const iduser = req.body.iduser;
    const token = req.body.token;
    const email = req.body.email;

    try {

        const db = admin.database();

        const query = db.ref('users').orderByKey();

        await query.once("value", snapshot => {
            let check = false;
            snapshot.forEach(child => {
                const key = child.key;
                if (key === iduser) {
                    db.ref("/users/" + key).update({
                        token: token
                    });

                    check = true;
                    return true;
                }
            });

            if (!check) {
                db.ref('/users/' + iduser).set({
                    iduser: iduser,
                    email: email,
                    token: token
                })
            }
        })

        res.json({
            status: "success",
        });
    } catch (err) {
        res.json({ message: err });
    }

});



module.exports = router;
