const express = require('express');
//const path = require('path');
const router = express.Router();

// Render the guest page
router.get('/', async (req, res) => {
        res.render('guestLanding');

});

module.exports = router;