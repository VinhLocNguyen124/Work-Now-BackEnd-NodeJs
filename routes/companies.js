const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
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


module.exports = router;