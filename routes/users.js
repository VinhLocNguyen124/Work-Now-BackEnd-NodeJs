const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Get back all users
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ _id: -1 });
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//Submit a user
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        urlavatar: req.body.urlavatar,
        phone: req.body.phone,
        province: req.body.province,
        city: req.body.city,
        qrcode: req.body.qrcode,
    });

    //Hàm save() trả về một promise
    try {
        const savedUser = await user.save()

        //trả về khi save thành công
        res.json({ status: "success", response: savedUser });
    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;
