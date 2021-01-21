const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

//Get all users
router.get('/', async (req, res) => {
    try {

        const companies = await Company.find().sort({ _id: -1 });

        res.json(companies);

    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;