const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const LikePost = require('../models/LikePost');
const Request = require('../models/Request');
const Comment = require('../models/Comment');
const admin = require("firebase-admin");

//Specific post
router.post('/specific', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.body.idpost });
        const userCurrent = await User.findOne({ email: req.body.emailcurrentuser }).exec();
        const idCurrentUser = userCurrent._id;

        const userPost = await User.findOne({ email: post.emailuser }).exec();
        const likepost = await LikePost.findOne({ idpost: post._id, iduser: idCurrentUser });
        const likeNumber = await LikePost.find({ idpost: post._id }).count();

        const comments = await Comment.find({ idpost: post._id });

        let listComment = [];

        if (comments.length > 0) {
            listComment = await Promise.all(comments.map(async item => {

                const user = await User.findOne({ _id: item.iduser }).exec();

                return {
                    _id: item._id,
                    username: user.username,
                    email: user.email,
                    urlavatar: user.urlavatar,
                    date: item.date,
                    cmtcontent: item.cmtcontent
                }
            }));
        }

        let shortCommentList = [];
        if (listComment.length > 5) {
            shortCommentList = [listComment[listComment.length - 5], listComment[listComment.length - 4], listComment[listComment.length - 3], listComment[listComment.length - 2], listComment[listComment.length - 1]];
        } else {
            shortCommentList = listComment;
        }


        const newPost = {
            _id: post._id,
            emailuser: post.emailuser,
            idpostshare: post.idpostshare,
            content: post.content,
            imgurl: post.imgurl,
            pdfurl: post.pdfurl,
            seescope: post.seescope,
            allowcmt: post.allowcmt,
            formal: post.formal,
            active: post.active,
            date: post.date,
            username: userPost.username,
            headline: userPost.headline,
            urlavatar: userPost.urlavatar,
            liked: likepost ? true : false,
            likenumber: likeNumber,
            cmtnumber: listComment.length,
            comments: listComment,
            shortComments: shortCommentList
        }


        res.json(newPost);
    } catch (err) {
        res.json({ message: err.message });
    }

});

//Get  all posts for specific newfeed
router.get('/:emailcurrentuser', async (req, res) => {

    const emailUser = req.params.emailcurrentuser;
    try {
        //Tìm tất cả bài viết
        //lọc ra 2 mảng post
        //một mảng đề xuất gồm các bài viết seescope = "anyone"
        //một mảng các bài post trong danh sách connection (là bạn bè thì sẽ thấy kể cả anyone và connection của seescope)
        //Nếu danh sách post của bạn bè ngắn hơn 50 bài thì sẽ thêm các bài viết đề xuất

        const _user = await User.findOne({ email: emailUser }).exec();
        const idCurrentUser = _user._id;
        const posts = await Post.find().sort({ date: -1 });

        let newListPost = [];
        let newListFriendPost = [];
        let listPostRecommend = [];
        if (posts.length > 0) {
            newListPost = await Promise.all(posts.map(async item => {

                const user = await User.findOne({ email: item.emailuser }).exec();
                const likepost = await LikePost.findOne({ idpost: item._id, iduser: idCurrentUser });
                const request = await Request.findOne({ idusersend: idCurrentUser, iduserrecieve: user._id, status: "done" });
                const request1 = await Request.findOne({ idusersend: user._id, iduserrecieve: idCurrentUser, status: "done" });

                const likeNumber = await LikePost.find({ idpost: item._id }).count();
                const cmtNumber = await Comment.find({ idpost: item._id }).count();

                //Kiểm tra posts nào của connector thì mới push, chỉ lấy của bạn và của chính mình
                if (request || request1 || emailUser === item.emailuser) {
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
                        likenumber: likeNumber,
                        cmtnumber: cmtNumber,
                        recommend: false
                    })
                }

                if (item.seescope === "anyone" || request || request1 || emailUser === item.emailuser) {
                    let recomm = false;

                    if (item.seescope === "anyone" && !request && !request1) {
                        recomm = true;
                    }

                    listPostRecommend.push({
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
                        likenumber: likeNumber,
                        cmtnumber: cmtNumber,
                        recommend: recomm
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
                    likenumber: likeNumber,
                    cmtnumber: cmtNumber,
                    recommend: false
                }

            }));
        }

        if (newListFriendPost.length < 50) {
            newListFriendPost = listPostRecommend;
        }

        res.json(newListFriendPost);
    } catch (err) {
        res.json({ message: err.message });
    }
});

//get all post of timeline
router.get('/timeline/:emailcurrentuser', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.params.emailcurrentuser }).exec();
        const idCurrentUser = user._id;
        const posts = await Post.find({ seescope: "anyone" }).sort({ _id: -1 });

        let newListPost = [];
        let newListFriendPost = [];
        if (posts.length > 0) {
            newListPost = await Promise.all(posts.map(async item => {

                const user = await User.findOne({ email: item.emailuser }).exec();
                const likepost = await LikePost.findOne({ idpost: item._id, iduser: idCurrentUser });
                const request = await Request.findOne({ idusersend: idCurrentUser, iduserrecieve: user._id, status: "done" });
                const request1 = await Request.findOne({ idusersend: user._id, iduserrecieve: idCurrentUser, status: "done" });

                //Kiểm tra posts nào của connector thì mới push, chỉ lấy của bạn
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

        if (newListFriendPost.length < 50) {
            newListFriendPost = newListPost;
        }

        res.json(newListFriendPost);
    } catch (err) {
        res.json({ message: err.message });
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
        const db = admin.database();
        await db.ref('/posts/' + savedPost._id).set({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });

        //trả về khi save thành công
        res.json({ status: "success", response: savedPost });
    } catch (err) {
        res.json({ message: err.message });
    }

});

//Update a specific post
router.patch('/update/content/:postID', async (req, res) => {

    const idpost = req.params.postID;
    const content = req.body.content;
    const imgurl = req.body.imgurl;

    try {

        const updatePost = await Post.updateOne(
            { _id: idpost },
            {
                $set: {
                    content: content,
                    imgurl: imgurl
                }
            }
        );

        //trả về khi save thành công
        res.json({ status: "success" });
    } catch (err) {
        res.json({ message: err.message });
    }

});

//User like post
router.post('/likepost', async (req, res) => {

    const likepost = new LikePost({
        idpost: req.body.idpost,
        iduser: req.body.iduser,
    });

    try {

        const savedLikePost = await likepost.save();
        const db = admin.database();
        await db.ref('/posts/' + req.body.idpost).set({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });

        res.json({
            status: "success", response: {
                savedLikePost,
            }
        });
    } catch (err) {
        res.json({ message: err.message });
    }

})

//User dislike post
router.post('/dislikepost', async (req, res) => {

    try {
        const deleteLikePost = await LikePost.deleteMany({
            idpost: req.body.idpost,
            iduser: req.body.iduser
        });
        const db = admin.database();
        await db.ref('/posts/' + req.body.idpost).set({
            update: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });

        res.json({
            status: "success", response: {
                deleteLikePost,
            }
        });
    } catch (error) {
        res.json({ message: err.message });
    }
})



//Delete post 
router.delete('/delete/:postId', async (req, res) => {

    const idpost = req.params.postId;

    try {
        const deletePost = await Post.deleteMany({ _id: idpost });
        const deleteLike = await LikePost.deleteMany({ idpost: idpost });
        const deleteCmt = await Comment.deleteMany({ idpost: idpost });

        res.json({
            status: "success"
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Update post 
router.patch('/update/formal/:postId', async (req, res) => {
    const idpost = req.params.postId;
    let formalValue;

    try {
        const post = await Post.findOne({ _id: idpost }).exec();

        if (post.formal) {
            formalValue = false;
        } else {
            formalValue = true;
        }

        const updatePost = await Post.updateOne(
            { _id: idpost },
            { $set: { formal: formalValue } }
        );

        res.json({
            status: "success"
        });
    } catch (err) {
        res.json({ message: err.message });
    }
})

module.exports = router;