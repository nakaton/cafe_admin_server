// Load config data from .env into process.env
require('dotenv').config();

const dbConnection = require('./config/dbConnection');
const express = require('./config/express');

const app = express();
const port = process.env.PORT || 5000

// Test DB connection and create pool when server start up
async function testDbConnection() {
    try {
        await dbConnection.createPool();
        await dbConnection.getPool().getConnection();
    } catch (err) {
        console.error(`Unable to connect to MySQL: ${err.message}`);
        process.exit(1);
    }
}

testDbConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port: ${port}`);
        })
    })