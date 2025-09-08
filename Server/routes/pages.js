const express = require('express');
const path = require('path');
const router = express.Router();

const pages = [/*'guest',*/ /*'studygroup',*/ 'privacypolicy', '_termsAndConditions'/*, 'profile'*/];
//const authPages = ['map', 'studygroup', 'profile']; //not working

//foreach loop to go through all pages that doesnt need authentication
pages.forEach(page => {
    router.get(`/${page}`, async (req, res) => {
        try {
            res.sendFile(`${page}.html`, { root: 'Pages' });

        } catch (error) {
       
            res.status(500).send({ error: `Failed to load ${page}.` });
        }
    });
});

module.exports = router;
