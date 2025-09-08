const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const router = express.Router();

// Render the login page
router.get('/', (req, res) => {
    res.render('LoginRegLanding', { error: null }); // Pass null error initially
});


// Handle login submission to authenticate user
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database using query
        const { rows } = await db.query('SELECT * FROM public.student_info WHERE public.student_info."UserName" = $1', [username]);
        if (rows.length === 0) { //compare if username is indeed in the DB
            return res.render('LoginRegLanding', { error: 'Invalid username or password' }); //if nothing is found page is reloaded
        }

        const user = rows[0]; //saves user 

        const isMatch = await bcrypt.compare(password, user.Password); //bool that compars userinput with db encrypted password

        //if no match is found it reloads the page to reattempt
        if (!isMatch) {           
            return res.render('LoginRegLanding', { error: 'Invalid username or password' });
        }

        //session is created storing cin, username
        req.session.user = { 
            id: user.Cin, 
            username: user.UserName, 
            rows:  { rows } 
        };
        console.log("USER FOUND:",req.session.user.id)
        // Successful login, redirect to another page
        res.redirect('/map');
    } 
    //throws error and reloads the page
    catch (error) {
        res.render('LoginRegLanding', { error: 'An error occurred. Please try again.' });
    }
});


module.exports = router;
