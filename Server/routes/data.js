const express = require('express'); //calls express module
const db = require('../config/database'); //calls the database connections
const router = express.Router(); //enables the express routing module
//const bodyParser = require('body-parser');
//router.use(bodyParser.json());

//basic query to get building data 
router.post('/data', async (req, res) => {
    const searchTerm = req.body.searchTerm; //grabs searchterm from user
    //query to search building from users input
    const query = 'SELECT * FROM public.buildings where public.buildings."BuildingName" ILIKE $1'; 
    const values = [`%${searchTerm}%`]; 

    //plugs query into db to begin search
    db.query(query, values, (err, result) => { 
        if (err) { 
            console.error('Error executing query:', err.stack); 
            res.status(500).send('Error occurred'); 
        } 
        else { 
            res.json(result.rows); 
        } 
    }); 
});

module.exports = router;
