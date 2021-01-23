const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Position = require('../models/Position');
const User = require('../models/User');
const UserCompany = require('../models/UserCompany');

//Get all companies
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find().sort({ _id: -1 });
        res.json(companies);
    } catch (err) {
        res.json({ message: err });
    }
});

//Adding experience
router.post('/addexp', async (req, res) => {

    const idcompany = req.body.companyid;

    try {

        if (idcompany !== "") {

            const usercompany = new UserCompany({
                iduser: req.body.iduser,
                idcompany: req.body.companyid,
                idposition: req.body.positionid,
                major: req.body.major,
                expyear: req.body.expyear
            });

            const savedUsercompany = await usercompany.save();
            //trả về khi save thành công
            res.json({
                status: "success", response: {
                    savedUsercompany,
                }
            });
        } else {
            const company = new Company({
                name: req.body.companyname
            });

            const savedCompany = await company.save();

            const usercompany = new UserCompany({
                iduser: req.body.iduser,
                idcompany: savedCompany._id,
                idposition: req.body.positionid,
                major: req.body.major,
                expyear: req.body.expyear
            });

            const savedUsercompany = await usercompany.save();
            //trả về khi save thành công
            res.json({
                status: "success", response: {
                    savedUsercompany,
                }
            });
        }

    } catch (err) {
        res.json({ message: err });
    }
});

//Update user exp
router.put('/updateexp/:usercompid', async (req, res) => {

    try {

        const company = await Company.findOne({ name: req.body.companyname }).exec();
        const position = await Position.findOne({ name: req.body.positionname }).exec();

        const updateUserCompany = await UserCompany.updateOne(
            { _id: req.params.usercompid },
            {
                $set: {
                    iduser: req.body.iduser,
                    idcompany: company._id,
                    idposition: position._id,
                    major: req.body.major,
                    expyear: req.body.expyear
                }
            }
        )
        res.json({
            status: "success", response: {
                updateUserCompany,
            }
        });
    } catch (err) {
        res.json({ message: err });
    }

});

//Delete user exp
router.delete('/deleteexp/:usercompid', async (req, res) => {

    try {

        const deleteUserCompany = await UserCompany.deleteOne({ _id: req.params.usercompid })
        res.json({
            status: "success", response: {
                deleteUserCompany,
            }
        });
    } catch (err) {
        res.json({ message: err });
    }

});


module.exports = router;