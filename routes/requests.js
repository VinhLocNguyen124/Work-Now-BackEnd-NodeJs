const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const Post = require('../models/Post');
const User = require('../models/User');
const Request = require('../models/Request');

const noti = require("../helpers/notification");
const findUserTokenByID = require("../helpers/findUserTokenByID");

//submit a request
router.post('/', async (req, res) => {

    const request = new Request({
        idusersend: req.body.idusersend,
        iduserrecieve: req.body.iduserrecieve,
        status: req.body.status,
    });

    try {
        const userRecieveToken = await findUserTokenByID.findUserTokenByID(req.body.iduserrecieve);
        const user = await User.findOne({ _id: req.body.idusersend }).exec();


        const requestCheckExist = await Request.findOne({
            idusersend: req.body.idusersend,
            iduserrecieve: req.body.iduserrecieve,
        });

        const requestCheckExistReverse = await Request.findOne({
            idusersend: req.body.iduserrecieve,
            iduserrecieve: req.body.idusersend,
        });

        if (!requestCheckExist && !requestCheckExistReverse) {
            await request.save();

            await noti.sendNotification(userRecieveToken, "Thông báo kết bạn !", `${user.username} vừa gửi cho bạn một lời mời kết nối. Bạn có quen ${user.username} không?`, user.urlavatar);

            const db = admin.database();
            await db.ref('/users/' + req.body.iduserrecieve).update({
                request: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            });
        }

        //trả về khi save thành công
        res.json({
            status: "success",
        });

    } catch (err) {
        res.json({ message: err.message });
    }

});

//Delete request
router.delete('/deleterequest/:idrequest', async (req, res) => {

    try {

        const deleterequest = await Request.deleteMany({ _id: req.params.idrequest })

        res.json({
            status: "success", response: {
                deleterequest,
            }
        });
    } catch (err) {
        res.json({ message: err.message });
    }

});

//Accept request 
router.put('/acceptrequest/:idrequest', async (req, res) => {
    try {
        const acceptRequest = await Request.updateOne(
            { _id: req.params.idrequest },
            { $set: { status: "done" } }
        )
        res.json({
            status: "success", response: {
                acceptRequest,
            }
        });
    } catch (err) {
        res.json({ message: err.message });
    }
})

//Check relationship
router.post('/checkrelationship', async (req, res) => {

    //Hàm save() trả về một promise
    try {
        const relation = await Request.findOne({ idusersend: req.body.idusersend, iduserrecieve: req.body.iduserrecieve });

        const relation1 = await Request.findOne({ idusersend: req.body.iduserrecieve, iduserrecieve: req.body.idusersend });

        if (relation) {
            if (relation.status === "pending") {
                res.json({
                    status: "waiting",
                });
            } else {
                res.json({
                    status: "yet",
                });
            }
        } else {
            if (relation1) {
                if (relation1.status === "pending") {
                    res.json({
                        status: "waiting",
                    });
                } else {
                    res.json({
                        status: "yet",
                    });
                }
            } else {
                res.json({
                    status: "not",
                });
            }

        }

    } catch (err) {
        res.json({ message: err.message });
    }

});

//List friend request
router.get('/friends/:idcurrentuser', async (req, res) => {
    try {
        const requests = await Request.find({ status: "done" }).exec();

        let listFriend = [];
        if (requests.length > 0) {
            const list = await Promise.all(requests.map(async item => {

                if (item.idusersend === req.params.idcurrentuser) {
                    const user = await User.findOne({ _id: item.iduserrecieve }).exec();

                    listFriend.push({
                        idconnect: item._id,
                        iduser: item.iduserrecieve,
                        username: user.username,
                        email: user.email,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });

                } else if (item.iduserrecieve === req.params.idcurrentuser) {
                    const user = await User.findOne({ _id: item.idusersend }).exec();

                    listFriend.push({
                        idconnect: item._id,
                        iduser: item.idusersend,
                        username: user.username,
                        email: user.email,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });
                }

            }));
        }

        res.json(listFriend);
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Remove connection (delete request with status = done) 
router.delete('/disconnect/:idconnect', async (req, res) => {

    try {

        const disconnect = await Request.deleteOne({ _id: req.params.idconnect })

        res.json({
            status: "success", response: {
                disconnect,
            }
        });
    } catch (err) {
        res.json({ message: err.message });
    }

});

//Search friend
router.post('/search/friends', async (req, res) => {

    const textSearch = req.body.textSearch;
    const idcurrentuser = req.body.idcurrentuser;

    try {
        const requests = await Request.find({ status: "done" }).exec();

        let listFriend = [];
        if (requests.length > 0) {
            const list = await Promise.all(requests.map(async item => {

                if (item.idusersend === idcurrentuser) {
                    const user = await User.findOne({ _id: item.iduserrecieve }).exec();

                    listFriend.push({
                        idconnect: item._id,
                        iduser: item.iduserrecieve,
                        username: user.username,
                        email: user.email,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });

                } else if (item.iduserrecieve === idcurrentuser) {
                    const user = await User.findOne({ _id: item.idusersend }).exec();

                    listFriend.push({
                        idconnect: item._id,
                        iduser: item.idusersend,
                        username: user.username,
                        email: user.email,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });
                }

            }));

            listFriend = listFriend.filter((friend) => {
                return friend.username.toLowerCase().trim().search(textSearch.toLowerCase().trim()) !== -1;
            });
        }

        res.json(listFriend);
    } catch (err) {
        res.json({ message: err.message });
    }

});

module.exports = router;