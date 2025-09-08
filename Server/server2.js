require('dotenv').config(); //enables server to run from .env environment
const express = require('express'); //adds the express module
const path = require('path'); //adds the path module
const bodyParser = require('body-parser');

// Import configurations and middlewares from session and security inhouse files
const sessionMiddleware = require('./config/session'); 
const securityConfig = require('./config/security');

// Import routes from inhouse files
const indexRoutes = require('./routes/index');
const dataRoutes = require('./routes/data');
//const loginRoutes = require('./routes/login');
const loginRoutes = require('./routes/LoginRegLanding');
const profileRoutes = require('./routes/profileLanding');
const pageRoutes = require('./routes/pages');
const mapRoutes = require('./routes/map');
const logoutRoutes = require('./routes/logout');

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
app.use('/login', loginRoutes); 
app.use('/logout', logoutRoutes); //data testing json
app.use('/map', mapRoutes); // map 
app.use('/profile', profileRoutes); //data testing json
app.use('', pageRoutes); //all pages

// Error Handling 404 to let user know when page is now found
app.use((req, res) => {
    res.status(404).send('404 -> Page not found');
});

//grabs the port from .env file or uses 4000 if taken
const PORT = process.env.Port || 4000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
