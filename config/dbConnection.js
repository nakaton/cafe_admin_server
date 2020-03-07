const mysql = require('promise-mysql');

let pool = null;

// Create DB Connnection Pool
exports.createPool = async () => {
    pool = await mysql.createPool({
        multipleStatements: true,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
};

// Get pool instance
exports.getPool = () => {
    return pool;
};