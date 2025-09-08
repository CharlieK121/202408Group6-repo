//const session = require('express-session'); //enables sessions for logins monitor
const session = require('cookie-session'); //enables sessions for logins monitor
//const MemoryStore = require('memorystore')(session);

//creates session/cookie to keep infromation about user before they need to reauthenticate
module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 6 * 60 * 1000, // 1 hour
    },
});
