const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Request = require('../models/Request');

//submit a request
router.post('/', async (req, res) => {

    const request = new Request({
        idusersend: req.body.idusersend,
        iduserrecieve: req.body.iduserrecieve,
        status: req.body.status,
    });

    //Hàm save() trả về một promise
    try {
        const savedRequest = await request.save();

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedRequest,
            }
        });

    } catch (err) {
        res.json({ message: err });
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
        res.json({ message: err });
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
        res.json({ message: err });
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
        res.json({ message: err });
    }

});

//List friend request
router.get('/friends/:idcurrentuser', async (req, res) => {
    try {
        const requests = await Request.find({ seescope: "anyone" }).sort({ _id: -1 });

        let listFriend = [];
        if (requests.length > 0) {
            listFriend = await Promise.all(requests.map(async item => {

                if (item.idusersend === idcurrentuser) {
                    const user = await User.findOne({ _id: item.idusersend }).exec();

                    listFriend.push({
                        _id: item._id,
                        iduser: item.idusersend,
                        username: user.username,
                        emailuser: user.emailuser,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });

                } else if (item.iduserrecieve === idcurrentuser) {
                    const user = await User.findOne({ _id: item.iduserrecieve }).exec();

                    listFriend.push({
                        _id: item._id,
                        iduser: item.iduserrecieve,
                        username: user.username,
                        emailuser: user.emailuser,
                        urlavatar: user.urlavatar,
                        headline: user.headline,
                    });
                }

            }));
        }

        res.json(listFriend);
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;