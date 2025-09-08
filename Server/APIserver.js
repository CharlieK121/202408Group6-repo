require('dotenv').config(); //server imports and runs enviroment code
const express = require('express'); //server imports and runs express web framework
const mysql = require('mysql2'); //server imports and runs mysql
const bodyParser = require('body-parser'); //server imports parser api
const session = require('express-session'); //server imports express session api
const rateLimit = require('express-rate-limit'); //server imports rate limit api to prevent brute force
const helmet = require('helmet'); //server imports security helmet api to help prevent injections

const appAPI = express(); //initialize web framework
appAPI.use(express.json());       
appAPI.use(express.urlencoded({extended: true})); 
const PORT = process.env.Port + 1 || 4000; //calls the port from env file

// CORS setup
const cors = require('cors');
appAPI.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin (your frontend)
    methods: ['GET', 'POST'], // Allow only GET and POST methods if you need
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers in the request
}));
const apiPort = 3001;

// Security configurations
appAPI.use(helmet());

appAPI.use(helmet({
    crossOriginResourcePolicy: false,
}));

//CSP configurations
appAPI.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://localhost:3001', 'http://localhost:3000'],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
    //reportOnly: true, // Set to 'true' to enable report-only mode
  })
);


// Database connection to mysql and calls the values from env file for security
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//checks the connections to the database and lets you know if there was an error 
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// middleware which is used in server sets up body parser, session, and path
appAPI.use(bodyParser.urlencoded({ extended: true })); //use the body parser
appAPI.use(session({
    secret: process.env.SESSION_SECRET, //grabs the session code from env for how long a user lasts
    resave: false,
    saveUninitialized: false,
    cookie: { //sets up cookies to keep track of infomation for security
        secure: process.env.NODE_ENV === 'production', // will use HTTPS in production when called on
        httpOnly: true, // stops client-side access to the cookie to avoid alterations
        maxAge: 60 * 60 * 1000 // 1 hour session ----/will discuss later to find out how long\----
    }
}));

////////////////  DB -> OO Conversion / Instantiation  //////////////////////////
const Building = require('../public/DBClasses/Back/Building');
const { count, error } = require('console');

//////////////////////// USER ////////////////////
const User = require('../public/DBClasses/Back/User');
const Class = require('../public/DBClasses/Back/Class');
const { resolve } = require('path');
let currentUser = null;
let currentCIN = 304057291;
let currentClassNo = [];
async function getUserData() {
  try {
    // Retrieve user
    const userResults = await new Promise((resolve, reject) => 
      db.query(`SELECT * FROM User where CIN = ${currentCIN}`, function (err, result) {
        if (err) reject(err);
        resolve(result);
      })
    );
    currentUser = new User(userResults[0].Username, userResults[0].Password, userResults[0].CIN,userResults[0].First_Name,userResults[0].Last_Name);
    ////////////////// USER CLASSES /////////////////////
    let i = -1;
    for (const key in userResults[0]) {
      i++;
      if(i<5) continue;
      if (userResults[0].hasOwnProperty(key) && userResults[0][key] != null && userResults[0][key]>0) {
        currentClassNo.push(userResults[0][key]);
      }
    }
    const classSubQuery = '(' + currentClassNo.join(', ')+')';
    delete currentClassNo;
    const userClassResults = await new Promise((resolve, reject) => 
      db.query(`SELECT c.*, b.building, b.latitude, b.longitude FROM Classes c, buildings b, buildingxref x  where ClassNumber IN ${classSubQuery} and c.Building = x.BuildingAbbreviation and x.BuildingName = b.building`, function (err, result) {
        if (err) reject(err);
        resolve(result);
      })
    );
    userClassResults.forEach( (c) => {
      currentUser.classes.push(new Class(c.Subject, c.Catalog, c.Section, c.ClassNumber,
        c.title,c.Days, c.StartTime, c.EndTime, new Building(c.building, c.latitude, c.longitude), c.Room, c.Instructor));
    });
    currentUser.print();
  }
   catch (err) {
    console.error('Error fetching user data:', err);
  }
}

// Call the function to get the data
// getUserData();
appAPI.get('/api/user', async (req, res) => {
    console.log('API route for buildings hit');  // Debugging log
    try {
      await getUserData(); // Assuming User Object is populated
      res.json({
        currentUser
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  appAPI.get('/api/searchBuildings', async (req, res) => {
    const searchQuery = req.query.query; // Get the search query from the front-end
  
    try {
      if (!searchQuery) {
        return res.status(400).json({ error: 'Query is missing' });
      }
      const results = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM buildings WHERE building LIKE ? LIMIT 5',
          [`%${searchQuery}%`], // Use parameterized query to prevent SQL injection
          (err, result) => {
            if (err) return reject(err); // Reject the Promise on error
            resolve(result); // Resolve the Promise with the result
          }
        );
      });
  
      if (results.length === 0) {
        return res.status(404).json({ results: [] });
      }
  
      res.json({ results }); // Send the filtered classes back to the front-end
    } catch (err) {
      console.error('Error in /api/searchBuildings:', err); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//error handling for undefined routes to let user know why its not working
appAPI.use((req, res) => {
    res.status(404).send('404 -> Page not found');
});
appAPI.listen(apiPort, () => {
console.log(`API Server running at http://localhost:${apiPort}`);
});