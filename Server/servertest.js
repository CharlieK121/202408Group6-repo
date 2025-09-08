require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const mysql = require('mysql2');
// const helmet = require('helmet');

// Import configurations and middlewares from session and security inhouse files
const sessionMiddleware = require('./config/session'); 
const securityConfig = require('./config/security');

// Import routes from inhouse files
const guestRoutes = require('./routes/guestLanding');
const indexRoutes = require('./routes/index');
const dataRoutes = require('./routes/data');
const loginRoutes = require('./routes/LoginRegLanding');
const profileRoutes = require('./routes/profileLanding');
const pageRoutes = require('./routes/pages');
const mapRoutes = require('./routes/map');


//enables express module
const app = express();
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views'));

// Apply middlewares to handle parsing on data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//config express server with security configuriations
securityConfig(app);
app.use(sessionMiddleware);

//enables the server to path static files (images, js, css, etc)
app.use(express.static(path.join(__dirname, '../public')));

// Use routes to handle on how the server goes to different pages
app.use('/', indexRoutes); //index
app.use('/', dataRoutes); //data testing json
app.use('/login', loginRoutes); //data testing json
app.use('/map', mapRoutes); // map 
app.use('/profile', profileRoutes); //data testing json
app.use('/guest', guestRoutes);
app.use('', pageRoutes); //all pages


// // Database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL');
// });

// Set up CORS
const allowedOrigins = ['http://localhost:3000', 'https://scholar-path.onrender.com']; 
app.use(cors({ 
  origin: (origin, callback) => { 
    if (!origin || allowedOrigins.indexOf(origin) !== -1) { 
      callback(null, true); 
    } else { 
      callback(new Error('Not allowed by CORS')); 
    } 
  }, 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


const db = require('./config/database'); //calls the database connections

////////////////  DB -> OO Conversion / Instantiation  //////////////////////////
const Building = require('../public/DBClasses/Back/Building');

//////////////////////// USER ////////////////////
const User = require('../public/DBClasses/Back/User');
const Class = require('../public/DBClasses/Back/Class');
const { resolve } = require('path');
let currentUser = null;
let currentCIN = 1000000;
let currentClassNo = [];
async function getUserData() {
  try {
    // Retrieve user
    const userResults = await new Promise((resolve, reject) => 
      db.query(`SELECT * FROM public."Student" where public."Student"."Cin" = ${currentCIN}`, function (err, result) {
        if (err) reject(err);
        resolve(result);
      })
    );
    console.log(userResults.rows)
    currentUser = new User(userResults.rows[0].UserName, userResults.rows[0].Password, userResults.rows[0].Cin,userResults.rows[0].FirstName,userResults.rows[0].LastName);
    currentUser.print()
    ////////////////// USER CLASSES /////////////////////
    userResults.rows[0].classes.forEach((c)  => {
        currentClassNo.push(c);
    })
    const classSubQuery = '(' + currentClassNo.join(', ')+')';
    delete currentClassNo;
    console.log(classSubQuery)
    const userClassResults = await new Promise((resolve, reject) => 
        db.query(`SELECT c.*, b."BuildingName", b."Latitude", b."Longitude"
        FROM public."Classes" AS c
        JOIN public."buildingxref" AS x ON c."Building" = x."BuildingAbbreviation"
        JOIN public."buildings" AS b ON x."Building" = b."BuildingName"
        WHERE c."ClassNumber" IN ${classSubQuery};`, 
        function (err, result) {
                if (err) reject(err);
                resolve(result);
    })

    //   db.query(`SELECT c.*, b.building, b.latitude, b.longitude FROM Classes c, buildings b, buildingxref x  where ClassNumber IN ${classSubQuery} and c.Building = x.BuildingAbbreviation and x.BuildingName = b.building`, function (err, result) {
    //     if (err) reject(err);
    //     resolve(result);
    //   })
    );
    userClassResults.rows.forEach( (c) => {
      currentUser.classes.push(new Class(c.Subject, c.Catalog, c.Section, c.ClassNumber,
        c.Title,c.Days, c.StartTime, c.EndTime, new Building(c.BuildingName, c.Latitude, c.Longitude), c.Room, c.Instructor));
    });
    // currentUser.print();
  }
   catch (err) {
    console.error('Error fetching user data:', err);
  }
}

// Call the function to get the data
app.get('/api/user', async (req, res) => {
    console.log('API route for user hit');  // Debugging log
     if (!req.session.user) {
        res.status(404).json({ error: "User not retrieved" });
    }
        // Assuming the API response has a `cin` field
        currentCIN = req.session.user.id;
        console.log(`CIN: ${currentCIN}`);
    try {
      await getUserData(); // Assuming User Object is populated
      res.json({
        currentUser
      });
    } catch (err) {
        console.error('Error in /api/user:', err); // Log the error for debugging
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/searchBuildings', async (req, res) => {
    const searchQuery = req.query.query; // Get the search query from the front-end
  
    try {
      if (!searchQuery) {
        return res.status(400).json({ error: 'Query is missing' });
      }
      console.log('SELECT * FROM public."buildings" WHERE "BuildingName" ILIKE',
                `'%${searchQuery}%'`)
        const results = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM public."buildings" WHERE "BuildingName" ILIKE $1 LIMIT 5', // Use $1 placeholder
                [`%${searchQuery}%`], // Pass the search query as the parameter
                (err, result) => {
                    if (err) return reject(err); // Reject the Promise on error
                    resolve(result); // Resolve the Promise with the result
                }
            );
        });
        console.log(results)
      if (results.length === 0) {
        return res.status(404).json({ results: [] });
      }
  
      res.json({ results }); // Send the filtered classes back to the front-end
    } catch (err) {
      console.error('Error in /api/searchBuildings:', err); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Serve React App (if using React for the frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//To fetch ghkey from .env
app.get('/api-key', (req, res) => { 
  res.json({ 
    apiKey: process.env.GH_KEY 
  }); 
});

// Handle all other routes (if you want to serve more pages using EJS)
app.get('/map', (req, res) => {
  res.render('maptest', { username: 'user', student_info: [] }); // Example EJS rendering
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server (servertest.js) running on http://localhost:${PORT}`);
//   console.log("Server Side:",dataRoutes)
});