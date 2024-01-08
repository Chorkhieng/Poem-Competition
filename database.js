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

async function getAllUsers(){
    return await connPool.awaitQuery('SELECT * FROM users');
}

async function createUser(first_name, last_name, username, password) {
    await connPool.awaitQuery('INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)',
                                [first_name, last_name, username, password]);
}

async function createSubmission(userId, text) {
    await connPool.awaitQuery('INSERT INTO submissions (author_id, poem_content) VALUES (?, ?)',
                                [userId, text]);
}

async function getAllSubmissions(){
    return await connPool.awaitQuery('SELECT * FROM submissions ORDER BY vote_count DESC');
}

async function updateVoteCount(userId, poemId){
    await connPool.awaitQuery('UPDATE submissions SET vote_count = (vote_count + ?) WHERE author_id = ? AND poem_id = ?',
                                [1, userId, poemId]);
}

module.exports = {getAllUsers, createUser, createSubmission, getAllSubmissions, updateVoteCount}