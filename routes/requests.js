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

module.exports = router;