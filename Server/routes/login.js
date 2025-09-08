const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const router = express.Router();

// Render the login page
router.get('/', (req, res) => {
    res.render('login', { error: null }); // Pass null error initially
});


// Handle login submission to authenticate user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database
        const { rows } = await db.query('SELECT * FROM public.student_info WHERE public.student_info."UserName" = $1', [username]);
       /* if (rows.length === 0) { //compare if username is indeed in the DB
            return res.render('login', { error: 'Invalid username or password' });
        } */

        const user = rows[0]; //saves user 
        
        // Compare the input password with the hashed password
        const isMatch = await bcrypt.compare(password, user.Password);

        console.log(isMatch);
        if (!isMatch) {
            
            return res.render('login', { error: 'Invalid username or password' });
        }

        req.session.user = { 
            id: user.Cin, 
            username: user.UserName, 
            rows:  { rows } 
        };

        // Successful login, redirect to another page
        res.redirect('/map/');
    } 
    catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

module.exports = router;
