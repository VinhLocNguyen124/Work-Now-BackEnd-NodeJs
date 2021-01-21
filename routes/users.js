const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserSchool = require('../models/UserSchool');
const UserCompany = require('../models/UserCompany');
const UserSkill = require('../models/UserSkill');
const Company = require('../models/Company');
const Position = require('../models/Position');

//Get all users
router.get('/', async (req, res) => {
    try {

        const users = await User.find().sort({ _id: -1 });

        res.json(users);

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
        headline: req.body.headline,
        underwork: req.body.underwork,
        path: req.body.path
    });

    //Hàm save() trả về một promise
    try {
        const savedUser = await user.save();

        //trả về khi save thành công
        res.json({
            status: "success", response: {
                savedUser,
            }
        });

    } catch (err) {
        res.json({ message: err });
    }

});

//Specific user
router.get('/:userEmail', async (req, res) => {
    try {
        const oneUser = await User.findOne({ email: req.params.userEmail }).exec();
        const userschool = await UserSchool.find({ iduser: oneUser._id }).exec();
        const usercompany = await UserCompany.find({ iduser: oneUser._id }).exec();
        const userskill = await UserSkill.find({ iduser: oneUser._id }).exec();

        let companies = [];
        if (usercompany.length > 0) {
            companies = usercompany.map((usercomp) => {
                // iduser, idcompany, idposition
                const company = Company.findOne({ _id: usercomp.idcompany }).exec();
                const position = Position.findOne({ _id: usercomp.idposition }).exec();
                return {
                    _id: usercomp._id,
                    companyname: company.name,
                    position: position.name,
                    major: usercomp.major,
                    expyear: usercomp.expyear
                }
            });
        }


        const newUser = {
            _id: oneUser._id,
            username: oneUser.username,
            email: oneUser.email,
            urlavatar: oneUser.urlavatar,
            phone: oneUser.phone,
            province: oneUser.province,
            city: oneUser.city,
            qrcode: oneUser.qrcode,
            headline: oneUser.headline,
            underwork: oneUser.underwork,
            path: oneUser.path,
            schools: userschool,
            companies: companies,
            skills: userskill
        }

        res.json(newUser);
    } catch (err) {
        res.json({ message: err });
    }

});

//Update user
router.put('/updateinfo/:userEmail', async (req, res) => {
    try {
        const updateUser = await User.updateOne(
            { email: req.params.userEmail },
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    urlavatar: req.body.urlavatar,
                    phone: req.body.phone,
                    province: req.body.province,
                    city: req.body.city,
                    headline: req.body.headline,
                    underwork: req.body.underwork,
                    path: req.body.path
                }
            }
        )
        res.json({
            status: "success", response: {
                updateUser,
            }
        });
    } catch (err) {
        res.json({ message: err });
    }
})


module.exports = router;
