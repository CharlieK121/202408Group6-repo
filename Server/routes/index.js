const express = require('express');
//const path = require('path');
const router = express.Router();

//basic index route
router.get('/', async (req, res) => {
    try {
        res.render('landing');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to load the homepage.' });
    }
});

module.exports = router;
