require('dotenv').config(); // server imports and runs environment code
const express = require('express'); // server imports and runs express web framework
const mysql = require('mysql2'); // server imports and runs mysql
const bodyParser = require('body-parser'); // server imports parser API
const session = require('express-session'); // server imports express session API
const bcrypt = require('bcrypt'); // server imports encryption API
const path = require('path'); // server imports path API
const { body, validationResult } = require('express-validator'); // server imports express validator API
const rateLimit = require('express-rate-limit'); // server imports rate-limit API to prevent brute force
const helmet = require('helmet'); // server imports security helmet API to help prevent injections

const app = express(); // initialize web framework
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.Port || 4000; // calls the port from env file

// Security configurations
app.use(helmet());

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// CSP configurations
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: [
                "'self'",
                'https://graphhopper.com/api/',
                'https://unpkg.com/leaflet-routing-machine@latest/',
                'http://localhost:3001',
            ],
            fontSrc: ["'self'", 'https://unpkg.com', 'https://fonts.gstatic.com'],
            imgSrc: [
                "'self'",
                'data:',
                'https://tile.openstreetmap.org',
                'https://b.tile.openstreetmap.org/',
                'https://c.tile.openstreetmap.org/',
                'https://a.tile.openstreetmap.org/',
                'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet.routing.icons.png',
                'https://unpkg.com/leaflet@1.2.0/dist/images/',
            ],
            scriptSrc: [
                "'self'",
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                'https://unpkg.com/leaflet@1.2.0/dist/leaflet.js',
                'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js',
                'https://graphhopper.com/',
                "'sha256-1BanquERJqfLzhCleCffGa/T7Da8Cn0F4hJV/ysG95U='",
                "'sha256-D4pOhdhsWmOq18zatL+1HkTvNt1Q1pBrdAbN+fcPEF0='",
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
            ],
            styleSrc: [
                "'self'",
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.2.0/dist/leaflet.css',
                'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
                'https://fonts.googleapis.com/',
            ],
            frameSrc: ["'self'"],
        },
    })
);

app.use(express.static('./public'));

// Database connection to MySQL and calls the values from env file for security
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Checks the connections to the database and lets you know if there was an error
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Middleware to set up body parser, session, and path
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET, // grabs the session code from env
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // will use HTTPS in production
            httpOnly: true, // prevents client-side access to the cookie
            maxAge: 60 * 60 * 1000, // 1 hour session
        },
    })
);
app.use(express.static(path.join(__dirname, 'views')));

// Route Path (get) Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/guest.html')); // opens guest.html
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM user WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                req.session.user = results[0];
                res.redirect('/map');
            } else {
                res.redirect('/');
            }
        }
    );
});

// Route Path (get) Map
app.get('/map', (req, res) => {
    res.sendFile('map.html', { root: 'Pages' });
});

// Route Path (post) Map
app.post('/map', (req, res) => {
    res.sendFile('map.html', { root: 'Pages' });
});

// Route Path (get) Guest
app.get('/guest', (req, res) => {
    res.sendFile('guest.html', { root: 'Pages' });
});

// Route Path (get) Study Group
app.get('/studygroup', (req, res) => {
    res.sendFile('studygroup.html', { root: 'Pages' });
});

// Route Path (get) Privacy Policy
app.get('/privacypolicy', (req, res) => {
    res.sendFile('privacypolicy.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/profile', (req, res) => {
    res.sendFile('profileLanding.html', { root: 'Pages' });
});


//////////////////////

// Route Path (get) Home page
app.get('/_index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/_index.html')); // opens guest.html
});



// Route Path (get) Map
app.get('/_map.html', (req, res) => {
    res.sendFile('_map.html', { root: 'Pages' });
});

// Route Path (post) Map
app.post('/_map.html', (req, res) => {
    res.sendFile('_map.html', { root: 'Pages' });
});

// Route Path (get) Guest
app.get('/_guest.html', (req, res) => {
    res.sendFile('_guest.html', { root: 'Pages' });
});

// Route Path (get) Study Group
app.get('/_studygroup.html', (req, res) => {
    res.sendFile('_studygroup.html', { root: 'Pages' });
});

// Route Path (get) Privacy Policy
app.get('/_privacypolicy.html', (req, res) => {
    res.sendFile('_privacypolicy.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_profile.html', (req, res) => {
    res.sendFile('_profileLanding.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_aboutUs.html', (req, res) => {
    res.sendFile('_aboutUs.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_events.html', (req, res) => {
    res.sendFile('_events.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_favorites.html', (req, res) => {
    res.sendFile('_favorites.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_password.html', (req, res) => {
    res.sendFile('_password.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_security.html', (req, res) => {
    res.sendFile('_security.html', { root: 'Pages' });
});

// Route Path (get) Profile
app.get('/_termsAndConditions.html', (req, res) => {
    res.sendFile('_termsAndConditions.html', { root: 'Pages' });
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).send('404 -> Page not found');
});

// Starts the localhost server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
