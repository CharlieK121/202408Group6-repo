require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path'); // For serving frontend files

const app = express(); // Initialize Express app

// Security configurations
app.use(helmet());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// CSP configurations
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 
            'http://localhost:3001', 
            'https://graphhopper.com/api/',
            'https://unpkg.com/leaflet-routing-machine@latest/'
        ],
        fontSrc: ["'self'", 
            'https://unpkg.com', 
            'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 
            'data:', 
            'https://tile.openstreetmap.org', 
            'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet.routing.icons.png', 
            'https://unpkg.com/leaflet@1.2.0/dist/images/'],
        scriptSrc: ["'self'", 
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 
            'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js', 
            'https://graphhopper.com/', 
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
            'https://code.jquery.com/jquery-3.6.0.min.js',
            `'nonce-${nonce}'`],
        styleSrc: ["'self'", 
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 
            'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css', 
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', 
            'https://fonts.googleapis.com/', 
            `'nonce-${nonce}'`],
        frameSrc: ["'self'"],
    }
}));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public'))); // Adjust the 'public' folder to your frontend build location

// Body parser middleware for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON requests

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
        maxAge: 60 * 60 * 1000 // 1 hour session
    }
}));

// API routes
const userRoute = require('./routes/user'); // Ensure you have separate files for API routes
app.use('/api/user', userRoute);

// Handle login page and submission
app.get('/login', (req, res) => {
    res.render('LoginRegLanding', { error: null }); // Login page
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { rows } = await db.query('SELECT * FROM public.student_info WHERE public.student_info."UserName" = $1', [username]);
        if (rows.length === 0) { // Check if username exists in DB
            return res.render('LoginRegLanding', { error: 'Invalid username or password' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.render('LoginRegLanding', { error: 'Invalid username or password' });
        }

        req.session.user = { 
            id: user.Cin, 
            username: user.UserName, 
            rows: { rows }
        };

        res.redirect('/map');
    } catch (error) {
        res.render('LoginRegLanding', { error: 'An error occurred. Please try again.' });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).send('404 -> Page not found');
});

// Port and server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
