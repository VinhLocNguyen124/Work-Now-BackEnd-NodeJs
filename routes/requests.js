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

module.exports = router;