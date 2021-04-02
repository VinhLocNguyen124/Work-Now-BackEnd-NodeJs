const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const admin = require("firebase-admin");

//Submit one  comment
router.post('/', async (req, res) => {

    const comment = new Comment({
        iduser: req.body.iduser,
        idpost: req.body.idpost,
        cmtcontent: req.body.cmtcontent,
    });

    //Hàm save() trả về một promise
    try {
        const savedComment = await comment.save();
        const db = admin.database();
        await db.ref('/posts/' + req.body.idpost).update({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        })

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedComment,
            }
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
