const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const admin = require("firebase-admin");
const noti = require("../helpers/notification");
const findUserTokenByID = require("../helpers/findUserTokenByID");

//Submit one  comment
router.post('/', async (req, res) => {

    const comment = new Comment({
        iduser: req.body.iduser,
        idpost: req.body.idpost,
        cmtcontent: req.body.cmtcontent,
    });

    //Hàm save() trả về một promise
    try {
        const interactionUser = await User.findOne({ _id: req.body.iduser }).exec();
        const iduserRecieveNoti = req.body.iduserRecieveNoti;
        const tokenUserRecieveNoti = await findUserTokenByID.findUserTokenByID(iduserRecieveNoti);

        const savedComment = await comment.save();

        //Gửi thông báo
        if (post.active && req.body.iduser !== iduserRecieveNoti) {
            await noti.sendNotification(tokenUserRecieveNoti, "Thông báo tương tác", `${interactionUser.username} đã bình luận về bài viết của bạn`, interactionUser.urlavatar)
        }

        //trigger gửi về client
        const db = admin.database();
        await db.ref('/posts/' + req.body.idpost).update({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });

        //trả về khi save thành công
        res.json({
            status: "success",
        });
    } catch (err) {
        res.json({ message: err });
    }

});

//Update comment
router.patch('/update/:cmtID', async (req, res) => {
    const idcmt = req.params.cmtID;
    const cmtcontent = req.body.cmtcontent;
    const idpost = req.body.idpost;

    try {

        const updateCmt = await Comment.updateOne(
            { _id: idcmt },
            { $set: { cmtcontent: cmtcontent } }
        );

        const db = admin.database();
        await db.ref('/posts/' + idpost).update({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        })

        res.json({
            status: "success"
        });
    } catch (err) {
        res.json({ message: err.message });
    }
})

//Delete cmt
router.delete('/delete/:cmtID', async (req, res) => {
    const idcmt = req.params.cmtID;
    const idpost = req.body.idpost;
    try {

        const deleteComment = await Comment.deleteMany({ _id: idcmt })

        const db = admin.database();
        await db.ref('/posts/' + idpost).update({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        })

        res.json({
            status: "success"
        });
    } catch (err) {
        res.json({ message: err });
    }

});


module.exports = router;
