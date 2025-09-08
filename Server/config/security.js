const helmet = require('helmet'); // Enables helmet module for security
const crypto = require('crypto'); // Enables crypto for randomness

module.exports = (app) => {
    // Generate a nonce for certain inline scripts or styles
    const nonce = crypto.randomBytes(16).toString('base64');

    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", 
                'https://graphhopper.com/api/', 
                'https://unpkg.com/leaflet-routing-machine@latest/',
                'https://scholar-path.onrender.com',
                /*, 
                'http://localhost:3001'*/],  // Allow localhost for API calls
            fontSrc: ["'self'", 
                'https://unpkg.com', 
                'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 
                'data:', 
                'https://tile.openstreetmap.org', 
                'https://tile.openstreetmap.org', 
                'https://b.tile.openstreetmap.org/', 
                'https://c.tile.openstreetmap.org/', 
                'https://a.tile.openstreetmap.org/', 
                'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet.routing.icons.png', 
                'https://unpkg.com/leaflet@1.2.0/dist/images/'],
            scriptSrc: ["'self'", 
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 
                'https://unpkg.com/leaflet@1.2.0/dist/leaflet.js', 
                'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js', 
                'https://graphhopper.com/', 
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
                'https://code.jquery.com/jquery-3.6.0.min.js',
                `'nonce-${nonce}'`],
            styleSrc: ["'self'", 
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 
                'https://unpkg.com/leaflet@1.2.0/dist/leaflet.css', 
                'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css', 
                'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css', 
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', 
                'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css', 
                'https://fonts.googleapis.com/', 
                `'nonce-${nonce}'`],
            frameSrc: ["'self'"],
        },
    }));
};
