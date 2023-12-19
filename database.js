// database file
// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await
var connPool = mysql.createPool({
    connectionLimit: 5,
    host: "127.0.0.1",
    user: "your username",
    database: "your database",
    password: "your password",
});



module.exports = {}