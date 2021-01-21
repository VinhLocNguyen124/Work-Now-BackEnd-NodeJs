const express = require('express');
const router = express.Router();
const Position = require('../models/Position');

//Get all positions
router.get('/', async (req, res) => {
    try {

        const positions = await Position.find().sort({ _id: -1 });

        res.json(positions);

    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;