const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Get back all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ _id: -1 });
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//Submit a post
router.post('/', async (req, res) => {
    const post = new Post({
        emailuser: req.body.emailuser,
        idpostshare: req.body.idpostshare,
        content: req.body.content,
        imgurl: req.body.imgurl,
        pdfurl: req.body.pdfurl,
        seescope: req.body.seescope,
        allowcmt: req.body.allowcmt,
        formal: req.body.formal,
        active: req.body.active,
    });

    //Hàm save() trả về một promise
    try {
        const savedPost = await post.save();

        //trả về khi save thành công
        res.json({ status: "success", response: savedPost });
    } catch (err) {
        res.json({ message: err });
    }

});

//Specific post
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }

});

//Delete post 
router.delete('/:postId', async (req, res) => {

    try {
        const removePost = await Post.remove({ _id: req.params.postId })
        res.json(removePost);
    } catch (err) {
        res.json({ message: err });
    }
});

//Update post 
router.patch('/:postId', async (req, res) => {
    try {
        const updatePost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { title: req.body.title } }
        )
        res.json(updatePost);
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;