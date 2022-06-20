const express = require('express');
const Model = require('../models/model');
const router = express.Router();

//Post Method
router.get('/', (req, res) => {
    res.send('Working');
})

module.exports = router;