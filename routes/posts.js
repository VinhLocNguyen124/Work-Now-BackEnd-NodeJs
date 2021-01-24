const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const LikePost = require('../models/LikePost');
const Request = require('../models/Request');


//Get  all posts
router.get('/:emailcurrentuser', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.params.emailcurrentuser }).exec();
        const idCurrentUser = user._id;

        const posts = await Post.find().sort({ _id: -1 });

        let newListPost = [];
        let newListFriendPost = [];
        if (posts.length > 0) {
            newListPost = await Promise.all(posts.map(async item => {

                const user = await User.findOne({ email: item.emailuser }).exec();
                const likepost = await LikePost.findOne({ idpost: item._id, iduser: idCurrentUser });
                const request = await Request.findOne({ idusersend: idCurrentUser, iduserrecieve: user._id, status: "done" });
                const request1 = await Request.findOne({ idusersend: user._id, iduserrecieve: idCurrentUser, status: "done" });

                if (request || request1) {
                    newListFriendPost.push({
                        _id: item._id,
                        emailuser: item.emailuser,
                        idpostshare: item.idpostshare,
                        content: item.content,
                        imgurl: item.imgurl,
                        pdfurl: item.pdfurl,
                        seescope: item.seescope,
                        allowcmt: item.allowcmt,
                        formal: item.formal,
                        active: item.active,
                        date: item.date,
                        username: user.username,
                        headline: user.headline,
                        urlavatar: user.urlavatar,
                        liked: likepost ? true : false,
                    })
                }

                return {
                    _id: item._id,
                    emailuser: item.emailuser,
                    idpostshare: item.idpostshare,
                    content: item.content,
                    imgurl: item.imgurl,
                    pdfurl: item.pdfurl,
                    seescope: item.seescope,
                    allowcmt: item.allowcmt,
                    formal: item.formal,
                    active: item.active,
                    date: item.date,
                    username: user.username,
                    headline: user.headline,
                    urlavatar: user.urlavatar,
                    liked: likepost ? true : false,
                }

            }));
        }

        res.json(newListFriendPost);
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

//User like post
router.post('/likepost', (req, res) => {

    const likepost = new LikePost({
        idpost: req.body.idpost,
        iduser: req.body.iduser,
    });

    likepost.save().then(savedLikePost => {
        res.json({
            status: "success", response: {
                savedLikePost,
            }
        });
    }).catch(error => {
        res.json({
            status: "error", response: {
                error
            }
        });
    })
})

//User dislike post
router.post('/dislikepost', async (req, res) => {

    try {
        const deleteLikePost = await LikePost.deleteMany({
            idpost: req.body.idpost,
            iduser: req.body.iduser
        });

        res.json({
            status: "success", response: {
                deleteLikePost,
            }
        });
    } catch (error) {
        res.json({ message: err });
    }


})

// //Specific post
// router.get('/:postId', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.postId);
//         res.json(post);
//     } catch (err) {
//         res.json({ message: err });
//     }

// });

// //Delete post 
// router.delete('/:postId', async (req, res) => {

//     try {
//         const removePost = await Post.remove({ _id: req.params.postId })
//         res.json(removePost);
//     } catch (err) {
//         res.json({ message: err });
//     }
// });

// //Update post 
// router.patch('/:postId', async (req, res) => {
//     try {
//         const updatePost = await Post.updateOne(
//             { _id: req.params.postId },
//             { $set: { title: req.body.title } }
//         )
//         res.json(updatePost);
//     } catch (err) {
//         res.json({ message: err });
//     }
// })

module.exports = router;