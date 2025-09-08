const { Pool } = require('pg'); //enables postgres module
const bcrypt = require('bcrypt');

//creates a pool which help keeps server async
const pool = new Pool({
    host: process.env.DB_HOST2,
    user: process.env.DB_USER2,
    password: process.env.DB_PASSWORD2,
    database: process.env.DB_NAME2,
    port: process.env.DB_PORT2,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Test connection asynchronously and send console message
(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
})();


/*//creates login
const min = 3000000; 
const max = 3400000; 
const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
const userId = 1; 
const userName = "1onaims1"; 
const fName = 'Angie';
const lName = 'Pollard';
const cin = randomNumber;
const password = '1234';
 // Generate salt and hash the password const 
saltRounds = 10; 
bcrypt.hash(password, saltRounds, (err, hash) => {
     if (err) { return console.error('Error hashing the password:', err);

      } 
      const updateQuery = 'UPDATE public."Student" SET "Password" = $1, "Cin"= $2, "FirstName"=$3, "LastName"=$4 WHERE "UserName" = $5';
      pool.query(updateQuery, [hash, cin, fName, lName, userName], (err, res) => { 
        if (err) { return console.error('Error updating user:', err.stack); 

        } 
        console.log('User updated successfully:', res.rowCount); 
    }); 
    pool.end((err) => { 
        if (err) { 
            return console.error('Error closing the connection:', err.stack); 
        } 
        console.log('Database connection closed.');
    })});
*/
module.exports = pool;
