const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const router = express.Router();

//routing to get map auth from login to access map
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    //doubles checks to see that session is stored in the cookie
    try {
        const {rows}= req.session.user.rows;
        res.render('profileLanding', { username: req.session.user.username });
    } 
    catch (error) {
        console.error('Error fetching dropdown data:', error);
        res.status(500).send('Failed to load dashboard data.');
    }
});

//checks correct url pathing to avoid backend entry
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const {rows}= req.session.user.rows;
        res.render('map', { username: req.session.user.username, student_info: rows });
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        res.status(500).send('Failed to load.');
    }
});

//checks correct url pathing to avoid backend entry
router.get('/map/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const {rows}= req.session.user.rows;
        res.render('map', { username: req.session.user.username, student_info: rows });
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        res.status(500).send('Failed to load dashboard data.');
    }
});

module.exports = router;
