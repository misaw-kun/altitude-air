const sqlite3 = require('sqlite3').verbose();
const path = require('path');
let dbPath;

dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

// creating user table (if it doesn't exist 🐱)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )
`, (err) => {
    if (err) {
        console.error('Error creating the users table', err);
    } else {
        console.log("Users table created successfully (if it doesn't exist)! ✅");
    }
});

module.exports = db;