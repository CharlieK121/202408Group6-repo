const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { 
    req.session = null; // This deletes the session cookie 
    res.redirect('/login');
});

module.exports = router;