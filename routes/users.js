const express = require('express');
const router = express.Router();

const User = require('../models/User');
const UserSchool = require('../models/UserSchool');
const UserCompany = require('../models/UserCompany');
const UserSkill = require('../models/UserSkill');
const Company = require('../models/Company');
const Position = require('../models/Position');
const Skill = require('../models/Skill');
const Request = require('../models/Request');

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

//Get specific user info by id
router.get('/userinfo/:iduser', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.iduser }).exec();

        res.json({
            _id: user._id,
            urlavatar: user.urlavatar,
            username: user.username,
            headline: user.headline,
            email: user.email,
        })

    } catch (error) {
        res.json({ message: err.message });
    }

});

//Specific user
router.get('/:userEmail', async (req, res) => {

    try {
        const oneUser = await User.findOne({ email: req.params.userEmail }).exec();
        const userschool = await UserSchool.find({ iduser: oneUser._id }).exec();
        const usercompany = await UserCompany.find({ iduser: oneUser._id }).exec();
        const userskill = await UserSkill.find({ iduser: oneUser._id }).exec();
        const requests = await Request.find({ iduserrecieve: oneUser._id, status: "pending" }).exec();

        let companies = [];
        if (usercompany.length > 0) {
            companies = await Promise.all(usercompany.map(async usercomp => {
                // iduser, idcompany, idposition
                const company = await Company.findOne({ _id: usercomp.idcompany }).exec();
                const position = await Position.findOne({ _id: usercomp.idposition }).exec();
                return {
                    _id: usercomp._id,
                    companyname: company.name,
                    position: position.name,
                    major: usercomp.major,
                    expyear: usercomp.expyear
                }
            }));
        }

        let userSkills = [];
        if (userskill.length > 0) {
            userSkills = await Promise.all(userskill.map(async item => {
                // iduser, idcompany, idposition
                const skill = await Skill.findOne({ _id: item.idskill }).exec();

                return {
                    _id: item._id,
                    name: skill.name,
                    type: skill.type,
                    important: item.bestskill
                }
            }));
        }

        let newRequests = [];
        if (requests.length > 0) {
            newRequests = await Promise.all(requests.map(async item => {
                // iduser, idcompany, idposition
                const user = await User.findOne({ _id: item.idusersend }).exec();

                return {
                    _id: item._id,
                    usernamesend: user.username,
                    idusersend: user._id,
                    urlavatar: user.urlavatar,
                    headline: user.headline
                }
            }));
        }

        // tính điểm profile 
        const computePointProfile = () => {
            let expPoint = 0;
            let eduPoint = 0;
            let positionPoint = 0;
            let skillPoint = 0;

            eduPoint = userschool.length * 5;

            companies && companies.map(item => {
                switch (item.position) {
                    case "Project Manager":
                        expPoint += 20;
                        break;
                    case "Tech-Leader":
                        expPoint += 17;
                        break;
                    case "Team-Leader":
                        expPoint += 15;
                        break;
                    case "Senior":
                        expPoint += 13;
                        break;
                    case "Mid-Senior":
                        expPoint += 11;
                        break;
                    case "Junior":
                        expPoint += 9;
                        break;
                    case "Fresher":
                        expPoint += 7;
                        break;
                    case "Intern":
                        expPoint += 5;
                        break;

                    default:
                        break;
                }
            });

            skillPoint = userSkills.length * 3;

            return expPoint + eduPoint + positionPoint + skillPoint;

        }

        const userpoint = computePointProfile();


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
            point: userpoint,
            schools: userschool,
            companies: companies,
            skills: userSkills,
            requests: newRequests
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
