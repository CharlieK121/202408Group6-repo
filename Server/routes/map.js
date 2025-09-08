const express = require('express');
const db = require('../config/database');
const crypto = require('crypto');  // Import crypto to generate nonce
const router = express.Router();

// Routing to check map auth from login to access map
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const { rows } = await db.query('SELECT * FROM student_info WHERE public.student_info."UserName" = $1', [req.session.user.username]);

        // Generate nonce for the Content Security Policy
        const nonce = crypto.randomBytes(16).toString('base64');
        console.log('Generated nonce:', nonce);  // This should log the generated nonce

        // Render the maptest.ejs template, passing the nonce and other data
        res.render('maptest', { 
            username: req.session.user.username, 
            student_info: rows, 
            nonce: nonce || ''  // Ensure nonce is always passed
        });
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        res.status(500).send('Failed to load dashboard data.');
    }
});

module.exports = router;